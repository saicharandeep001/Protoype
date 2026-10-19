import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const globalDb = globalThis as unknown as {
  contextDb?: DatabaseSync;
  contextSchemaVersion?: number;
};
export function db() {
  if (globalDb.contextDb && globalDb.contextSchemaVersion === 2)
    return globalDb.contextDb;
  // Runtime storage is provisioned separately; never bundle the learner database.
  const path = resolve(
    /* turbopackIgnore: true */ process.env.DATABASE_PATH ||
      ".data/context.sqlite",
  );
  mkdirSync(dirname(path), { recursive: true });
  const database = globalDb.contextDb || new DatabaseSync(path);
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      password_hash TEXT NOT NULL, grade INTEGER NOT NULL DEFAULT 11,
      goal TEXT NOT NULL DEFAULT 'CBSE + JEE', interests TEXT NOT NULL DEFAULT '["Cricket","Cooking"]', created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL, question_id TEXT NOT NULL, answer TEXT NOT NULL,
      correct INTEGER NOT NULL, assisted INTEGER NOT NULL, created_at INTEGER NOT NULL, content_version INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS attempts_user_lesson ON attempts(user_id, lesson_id, id);
    CREATE TABLE IF NOT EXISTS hints (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, lesson_id TEXT NOT NULL,
      question_id TEXT NOT NULL, PRIMARY KEY(user_id, lesson_id, question_id)
    );
    CREATE TABLE IF NOT EXISTS progress (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, lesson_id TEXT NOT NULL,
      stage INTEGER NOT NULL DEFAULT 0, interest TEXT NOT NULL DEFAULT 'Direct',
      updated_at INTEGER NOT NULL, review_due INTEGER, PRIMARY KEY(user_id, lesson_id)
    );
    CREATE TABLE IF NOT EXISTS login_limits (key TEXT PRIMARY KEY, failures INTEGER NOT NULL, reset_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS coach_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL, question TEXT NOT NULL, reply TEXT NOT NULL,
      source TEXT NOT NULL, follow_up TEXT NOT NULL, supported INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS coach_user_lesson ON coach_messages(user_id,lesson_id,id);
    CREATE TABLE IF NOT EXISTS pilot_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      clarity INTEGER NOT NULL CHECK(clarity BETWEEN 1 AND 5),
      relevance INTEGER NOT NULL CHECK(relevance BETWEEN 1 AND 5),
      note TEXT NOT NULL, created_at INTEGER NOT NULL
    );
  `);
  const columns = database.prepare("PRAGMA table_info(users)").all() as {
    name: string;
  }[];
  if (!columns.some((column) => column.name === "is_demo")) {
    database.exec(
      "ALTER TABLE users ADD COLUMN is_demo INTEGER NOT NULL DEFAULT 0",
    );
  }
  database.exec("PRAGMA user_version = 2");
  globalDb.contextDb = database;
  globalDb.contextSchemaVersion = 2;
  return database;
}
