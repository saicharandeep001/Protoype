import "server-only";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "./db";
import type { Learner } from "./types";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, hash: string) {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;
  const expected = Buffer.from(key, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
const digest = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export async function createSession(userId: string) {
  const jar = await cookies();
  const old = jar.get("cbc_session")?.value;
  if (old)
    db().prepare("DELETE FROM sessions WHERE token_hash = ?").run(digest(old));
  db().prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  const token = randomBytes(32).toString("hex");
  db()
    .prepare("INSERT INTO sessions VALUES (?, ?, ?)")
    .run(digest(token), userId, Date.now() + 30 * 86400000);
  jar.set("cbc_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.SECURE_COOKIES === "1",
    path: "/",
    maxAge: 30 * 86400,
  });
}
export async function destroySession() {
  const jar = await cookies();
  const token = jar.get("cbc_session")?.value;
  if (token)
    db()
      .prepare("DELETE FROM sessions WHERE token_hash = ?")
      .run(digest(token));
  jar.delete("cbc_session");
}
export const currentLearner = cache(async (): Promise<Learner | null> => {
  const token = (await cookies()).get("cbc_session")?.value;
  if (!token) return null;
  const row = db()
    .prepare(
      `SELECT u.id, u.name, u.username, u.grade, u.goal, u.interests, u.is_demo FROM users u JOIN sessions s ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?`,
    )
    .get(digest(token), Date.now()) as
    | (Omit<Learner, "interests"> & { interests: string })
    | undefined;
  return row ? { ...row, interests: JSON.parse(row.interests) } : null;
});
export async function requireLearner() {
  const user = await currentLearner();
  if (!user) redirect("/login");
  return user;
}
