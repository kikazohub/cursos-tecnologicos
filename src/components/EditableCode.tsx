"use client";

import { useState } from "react";
import { Loader2, Pencil, Play, RotateCcw } from "lucide-react";

interface ExecOutput {
  ok: boolean;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  durationMs: number;
  truncated: boolean;
  exitCode: number | null;
  message?: string;
}

interface Props {
  lang: string;
  code: string;
  title?: string;
  files?: Record<string, string>;
  run?: boolean;
  variant?: "code" | "shell";
}

export function EditableCode({
  lang,
  code,
  title,
  files,
  run = false,
  variant = "code",
}: Props) {
  const [value, setValue] = useState(code);
  const [dirty, setDirty] = useState(false);
  const [running, setRunning] = useState(false);
  const [out, setOut] = useState<ExecOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isShell = lang === "shell" || variant === "shell";

  async function execute() {
    setRunning(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isShell
            ? { lang: "shell", cmd: value }
            : { lang, code: value, files },
        ),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setOut(null);
        setErrorMsg(data.error ?? (data.result?.message ?? "Error al ejecutar"));
      } else {
        setOut(data.result);
      }
    } catch {
      setErrorMsg("No se pudo conectar con el servidor.");
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setValue(code);
    setDirty(false);
    setOut(null);
    setErrorMsg(null);
  }

  const rows = Math.min(20, Math.max(4, value.split("\n").length));

  return (
    <div className="fade-up">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {title && (
            <span className="font-mono text-[0.78rem] font-semibold text-dim">
              {title}
            </span>
          )}
          <span className="rounded bg-edge/60 px-1.5 py-0.5 text-[0.68rem] uppercase tracking-wide text-dim">
            {lang}
          </span>
          <span className="inline-flex items-center gap-1 text-[0.68rem] text-dim">
            <Pencil className="h-3 w-3 text-accent" /> editable
          </span>
        </div>
        {(dirty || out || errorMsg) && (
          <button
            onClick={reset}
            className="btn btn-ghost px-2.5 py-1 text-xs"
            title="Volver al código original"
          >
            <RotateCcw className="h-3 w-3" /> Restablecer
          </button>
        )}
      </div>

      <div
        className="overflow-hidden rounded-xl border border-edge bg-[#05070d]"
        style={{ fontSize: "0.85rem" }}
      >
        <div
          className="flex items-center justify-between gap-2 border-b border-edge bg-surface px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span className="term-dots">
              <span className="term-dot bg-[#ff5f57]" />
              <span className="term-dot bg-[#febc2e]" />
              <span className="term-dot bg-[#28c840]" />
            </span>
          </div>
          {run && (
            <button
              onClick={execute}
              disabled={running}
              className="btn btn-primary px-3 py-1.5 text-xs"
            >
              {running ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {running ? "Ejecutando…" : out ? "Ejecutar de nuevo" : "Ejecutar"}
            </button>
          )}
        </div>
        {isShell && <div className="px-4 pt-3 text-accent select-none">$</div>}
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setDirty(true);
          }}
          onKeyDown={(e) => {
            if (run && (e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              void execute();
            }
            if (e.key === "Tab") {
              e.preventDefault();
              const el = e.currentTarget;
              const start = el.selectionStart;
              const end = el.selectionEnd;
              setValue((v) => v.slice(0, start) + "  " + v.slice(end));
              setDirty(true);
              requestAnimationFrame(() => {
                el.selectionStart = el.selectionEnd = start + 2;
              });
            }
          }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          rows={isShell ? 1 : rows}
          className="w-full min-h-0 resize-y bg-transparent px-4 py-3 font-mono text-txt leading-relaxed outline-none"
          style={{ tabSize: 2 }}
          placeholder={isShell ? "Escribe un comando…" : undefined}
          aria-label={title ?? `Código ${lang}`}
        />
      </div>

      {run && !out && !errorMsg && !dirty && (
        <p className="mt-1.5 text-[0.7rem] text-dim">
          {isShell
            ? "✏️ Edita el comando y pulsa Ejecutar (o Ctrl+Enter)."
            : "✏️ Edita el código y pulsa Ejecutar (o Ctrl+Enter)."}
        </p>
      )}

      {run && <div className="term mt-3">
        <div className="term-head">
          <div className="flex items-center gap-2">
            <span className="term-dots">
              <span className="term-dot bg-[#ff5f57]" />
              <span className="term-dot bg-[#febc2e]" />
              <span className="term-dot bg-[#28c840]" />
            </span>
            <span className="text-[0.78rem] font-semibold text-dim">
              {title ? `${title} — salida` : `${lang} — salida`}
            </span>
          </div>
        </div>
        <div className="term-body min-h-[3rem]">
          {errorMsg && <p className="text-err">{errorMsg}</p>}
          {out && !errorMsg && (
            <>
              {out.stdout}
              {out.stderr && <span className="text-warn">{out.stderr}</span>}
              <div className="mt-2 flex items-center gap-3 text-[0.72rem] text-dim">
                <span className={out.ok ? "text-ok" : "text-err"}>
                  {out.ok ? "✓ salida 0" : `✗ código ${out.exitCode ?? "?"}`}
                </span>
                <span>{(out.durationMs / 1000).toFixed(2)} s</span>
                {out.timedOut && <span className="text-err">agotado (15s)</span>}
                {out.truncated && <span>salida cortada</span>}
              </div>
            </>
          )}
          {!out && !errorMsg && (
            <span className="text-dim">
              Pulsa <b>Ejecutar</b> para correr este {isShell ? "comando" : "código"}.
            </span>
          )}
        </div>
        {!running && out && (
          <div className="term-in justify-end text-[0.7rem] text-dim">
            <button onClick={() => setOut(null)} className="inline-flex items-center gap-1 hover:text-txt">
              <RotateCcw className="h-3 w-3" /> limpiar
            </button>
          </div>
        )}
      </div>}
    </div>
  );
}