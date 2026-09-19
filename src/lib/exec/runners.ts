import "server-only";
import { execFile } from "node:child_process";
import { transformSync } from "esbuild";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

export type ExecLang = "node" | "ts" | "python" | "go" | "rust" | "shell";

export interface ExecRequest {
  lang: ExecLang;
  code?: string;
  cmd?: string;
  files?: Record<string, string>;
}

export interface ExecResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  durationMs: number;
  truncated: boolean;
  exitCode: number | null;
  message?: string;
}

const MAX_CODE_BYTES = 50_000;
const MAX_FILES = 12;
const TIMEOUT_MS = 15_000;
const MAX_OUTPUT = 32 * 1024;

function sanitizeName(name: string): string | null {
  if (!/^[A-Za-z0-9._-]+$/.test(name)) return null;
  if (name.includes("..")) return null;
  return name;
}

function cap(s: string): { text: string; truncated: boolean } {
  if (Buffer.byteLength(s) <= MAX_OUTPUT) return { text: s, truncated: false };
  return { text: s.slice(0, MAX_OUTPUT) + "\n… (salida truncada)", truncated: true };
}

function resolveBin(name: string, cwd: string): Promise<string | null> {
  return execFileP("bash", ["-lc", `command -v ${name}`], { cwd })
    .then((r) => r.stdout.trim() || null)
    .catch(() => null);
}

interface BuiltCommand {
  cmd: string;
  env?: Record<string, string>;
  argsPreparation?: () => void;
}

async function prepare(
  req: ExecRequest,
  dir: string
): Promise<BuiltCommand | { error: string }> {
  const writeFiles = (files: Record<string, string>) => {
    const entries = Object.entries(files).slice(0, MAX_FILES);
    for (const [name, content] of entries) {
      const safe = sanitizeName(name);
      if (!safe) continue;
      const filePath = path.join(dir, safe);
      mkdirSync(path.dirname(filePath), { recursive: true });
      writeFileSync(filePath, content);
    }
  };

  const mainContent = req.code ?? "";

  switch (req.lang) {
    case "node": {
      if (Buffer.byteLength(mainContent) > MAX_CODE_BYTES) return { error: "Código demasiado largo." };
      writeFileSync(path.join(dir, "main.js"), mainContent);
      if (req.files) writeFiles(req.files);
      return { cmd: `node main.js` };
    }
    case "ts": {
      if (Buffer.byteLength(mainContent) > MAX_CODE_BYTES) return { error: "Código demasiado largo." };
      let js: string;
      try {
        js = transformSync(mainContent, { loader: "ts", format: "esm", target: "es2022" }).code;
      } catch (e) {
        return { error: `Error de TypeScript: ${(e as Error).message}` };
      }
      writeFileSync(path.join(dir, "main.mjs"), js);
      if (req.files) writeFiles(req.files);
      return { cmd: `node main.mjs` };
    }
    case "python": {
      if (Buffer.byteLength(mainContent) > MAX_CODE_BYTES) return { error: "Código demasiado largo." };
      const py = await resolveBin("python3", dir);
      if (!py) return { error: "python3 no está disponible en PATH." };
      writeFileSync(path.join(dir, "main.py"), mainContent);
      if (req.files) writeFiles(req.files);
      return { cmd: `python3 main.py`, env: { PYTHONDONTWRITEBYTECODE: "1", PYTHONIOENCODING: "utf-8" } };
    }
    case "go": {
      if (Buffer.byteLength(mainContent) > MAX_CODE_BYTES) return { error: "Código demasiado largo." };
      const go = await resolveBin("go", dir);
      if (!go) return { error: "go no está disponible. Ejecuta: mise use -g golang@latest" };
      writeFileSync(path.join(dir, "go.mod"), "module sandbox\n\ngo 1.22\n");
      writeFileSync(path.join(dir, "main.go"), mainContent);
      if (req.files) writeFiles(req.files);
      return { cmd: `go run main.go`, env: { GOCACHE: path.join(dir, ".gocache") } };
    }
    case "rust": {
      if (Buffer.byteLength(mainContent) > MAX_CODE_BYTES) return { error: "Código demasiado largo." };
      const rustc = await resolveBin("rustc", dir);
      if (!rustc) return { error: "rustc no está disponible. Ejecuta: mise use -g rust@latest" };
      writeFileSync(path.join(dir, "main.rs"), mainContent);
      if (req.files) writeFiles(req.files);
      return { cmd: `rustc --edition 2024 main.rs -o prog && ./prog`, env: {} };
    }
    case "shell": {
      const c = req.cmd ?? "";
      if (Buffer.byteLength(c) > 4_000) return { error: "Comando demasiado largo." };
      return { cmd: c, env: {} };
    }
  }
}

export async function runCode(req: ExecRequest): Promise<ExecResult> {
  const started = Date.now();
  const dir = mkdtempSync(path.join(tmpdir(), "cursos-exec-"));

  const built = await prepare(req, dir);
  if ("error" in built) {
    return {
      ok: false,
      stdout: "",
      stderr: "",
      timedOut: false,
      durationMs: Date.now() - started,
      truncated: false,
      exitCode: null,
      message: built.error,
    };
  }

  const env = { ...process.env, ...(built.env ?? {}) };

  try {
    const { stdout, stderr } = await execFileP("bash", ["-lc", built.cmd], {
      cwd: dir,
      env,
      timeout: TIMEOUT_MS,
      maxBuffer: MAX_OUTPUT * 2,
      windowsHide: true,
    });

    const cappedOut = cap(stdout);
    const cappedErr = cap(stderr);
    return {
      ok: true,
      stdout: cappedOut.text,
      stderr: cappedErr.text,
      timedOut: false,
      durationMs: Date.now() - started,
      truncated: cappedOut.truncated || cappedErr.truncated,
      exitCode: 0,
    };
  } catch (err) {
    const e = err as {
      stdout?: string | Buffer;
      stderr?: string | Buffer;
      code?: number;
      signal?: string | null;
      timedOut?: boolean;
      killed?: boolean;
    };
    const out = typeof e.stdout === "string" ? e.stdout : (e.stdout as Buffer)?.toString?.() ?? "";
    const errText =
      typeof e.stderr === "string" ? e.stderr : (e.stderr as Buffer)?.toString?.() ?? "";
    const timedOut = !!e.timedOut || e.killed === true || e.signal === "SIGTERM" || e.signal === "SIGKILL";
    const cappedOut = cap(out);
    const cappedErr = cap(errText);
    return {
      ok: false,
      stdout: cappedOut.text,
      stderr: timedOut ? "⏱️ Tiempo agotado (15s). ¿Bucle infinito?" : cappedErr.text,
      timedOut,
      durationMs: Date.now() - started,
      truncated: cappedOut.truncated || cappedErr.truncated,
      exitCode: e.code ?? null,
    };
  }
}