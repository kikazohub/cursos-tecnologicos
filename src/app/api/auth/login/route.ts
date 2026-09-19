import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUserByUsername, verifyPassword, touchLogin } from "@/lib/db/users";
import { createSession, SESSION_COOKIE } from "@/lib/db/sessions";
import { SESSION_COOKIE_OPTS } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export interface LoginResponse {
  ok: boolean;
  error?: string;
  user?: { id: number; username: string };
}

export async function POST(request: Request): Promise<NextResponse<LoginResponse>> {
  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const user = findUserByUsername(username);
  if (!user || !verifyPassword(password, user.salt, user.password_hash)) {
    return NextResponse.json({ ok: false, error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  const token = createSession(user.id);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTS);
  touchLogin(user.id);

  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username } });
}