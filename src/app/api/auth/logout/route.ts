import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession, SESSION_COOKIE } from "@/lib/db/sessions";
import { SESSION_COOKIE_OPTS } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(): Promise<NextResponse<{ ok: boolean }>> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    deleteSession(token);
    store.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTS, maxAge: 0 });
    store.delete(SESSION_COOKIE);
  }
  return NextResponse.json({ ok: true });
}