import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export interface MeResponse {
  ok: boolean;
  user?: { id: number; username: string };
}

export async function GET(): Promise<NextResponse<MeResponse>> {
  const user = await getCurrentUser();
  return NextResponse.json({ ok: true, user: user ?? undefined });
}