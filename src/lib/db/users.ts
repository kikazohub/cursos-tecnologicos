import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getDb } from "./db";

export interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  salt: string;
  created_at: string;
  last_login: string | null;
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const candidate = scryptSync(password, salt, 64);
  const stored = Buffer.from(expectedHash, "hex");
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}

export function createUser(username: string, password: string): UserRow {
  const { hash, salt } = hashPassword(password);
  const db = getDb();
  const stmt = db.prepare(
    "INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?) RETURNING *"
  );
  return stmt.get(username, hash, salt) as unknown as UserRow;
}

export function findUserByUsername(username: string): UserRow | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as
    | UserRow
    | undefined;
  return row;
}

export function findUserById(id: number): UserRow | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
  return row;
}

export function touchLogin(id: number): void {
  const db = getDb();
  db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(id);
}