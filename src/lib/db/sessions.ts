import "server-only";
import { randomBytes } from "node:crypto";
import { getDb } from "./db";

export const SESSION_COOKIE = "ct_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 días

export interface SessionRow {
  token: string;
  user_id: number;
  created_at: string;
  expires_at: string;
}

export type SessionUser = { id: number; username: string };

export function createSession(userId: number): string {
  const token = randomBytes(32).toString("hex");
  const db = getDb();
  db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+30 days'))"
  ).run(token, userId);
  return token;
}

export function getSessionUser(token: string): SessionUser | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT s.token, s.user_id, s.expires_at, u.username
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token = ?`
    )
    .get(token) as
    | { token: string; user_id: number; expires_at: string; username: string }
    | undefined;

  if (!row) return null;
  if (new Date(row.expires_at + "Z").getTime() < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }
  return { id: row.user_id, username: row.username };
}

export function deleteSession(token: string): void {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function cleanupExpiredSessions(): void {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
}