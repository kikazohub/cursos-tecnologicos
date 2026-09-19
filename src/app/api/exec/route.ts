import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { runCode, type ExecLang, type ExecRequest } from "@/lib/exec/runners";

export const dynamic = "force-dynamic";

export interface ExecResponse {
  ok: boolean;
  result?: import("@/lib/exec/runners").ExecResult;
  error?: string;
}

const ALLOWED_LANGS: ExecLang[] = ["node", "ts", "python", "go", "rust", "shell"];

export async function POST(request: Request): Promise<NextResponse<ExecResponse>> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Inicia sesión para ejecutar código." }, { status: 401 });
  }

  let body: { lang?: unknown; code?: unknown; cmd?: unknown; files?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const lang = body.lang as ExecLang;
  if (!ALLOWED_LANGS.includes(lang)) {
    return NextResponse.json({ ok: false, error: "Lenguaje no soportado." }, { status: 400 });
  }

  const req: ExecRequest = {
    lang,
    code: typeof body.code === "string" ? body.code : undefined,
    cmd: typeof body.cmd === "string" ? body.cmd : undefined,
    files:
      body.files && typeof body.files === "object"
        ? (body.files as Record<string, string>)
        : undefined,
  };

  const result = await runCode(req);
  return NextResponse.json({ ok: result.ok, result });
}