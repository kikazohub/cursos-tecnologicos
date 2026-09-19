import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createUser, findUserByUsername } from "@/lib/db/users";
import { createSession, SESSION_COOKIE } from "@/lib/db/sessions";
import { SESSION_COOKIE_OPTS } from "@/lib/auth/session";
import { awardBadge, awardXp } from "@/lib/gamification";

export const dynamic = "force-dynamic";

export interface RegisterResponse {
  ok: boolean;
  error?: string;
  user?: { id: number; username: string };
}

export async function POST(request: Request): Promise<NextResponse<RegisterResponse>> {
  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!/^[A-Za-z0-9_.-]{3,30}$/.test(username)) {
    return NextResponse.json(
      { ok: false, error: "El usuario debe tener 3-30 caracteres: letras, números, _ . -" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json({ ok: false, error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
  }
  if (findUserByUsername(username)) {
    return NextResponse.json({ ok: false, error: "Ese usuario ya existe. Prueba otro nombre." }, { status: 409 });
  }

  const user = createUser(username, password);
  const token = createSession(user.id);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTS);

  awardBadge(user.id, "primeros-pasos");
  awardXp(user.id, 50);

  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username } });
}