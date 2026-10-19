import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("schema upgrade preserves existing learners and is repeatable", async () => {
  const dir = mkdtempSync(join(tmpdir(), "peduc-migration-"));
  process.env.DATABASE_PATH = join(dir, "legacy.sqlite");
  const old = new DatabaseSync(process.env.DATABASE_PATH);
  old.exec(
    "CREATE TABLE users(id TEXT PRIMARY KEY,username TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password_hash TEXT NOT NULL,grade INTEGER NOT NULL DEFAULT 11,goal TEXT NOT NULL DEFAULT 'CBSE + JEE',interests TEXT NOT NULL DEFAULT '[]',created_at INTEGER NOT NULL); PRAGMA user_version=1;",
  );
  old
    .prepare(
      "INSERT INTO users(id,username,name,password_hash,created_at) VALUES(?,?,?,?,?)",
    )
    .run("legacy-id", "legacy-user", "Existing learner", "test-only-hash", 1);
  old.close();
  const { db } = await import("../src/lib/db");
  const database = db();
  const user = database
    .prepare("SELECT username,is_demo FROM users WHERE id=?")
    .get("legacy-id") as { username: string; is_demo: number };
  assert.equal(user.username, "legacy-user");
  assert.equal(user.is_demo, 0);
  assert.equal(
    (database.prepare("PRAGMA user_version").get() as { user_version: number })
      .user_version,
    2,
  );
  assert.equal(db(), database);
  assert.equal(
    (database.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number })
      .n,
    1,
  );
  database
    .prepare(
      "INSERT INTO coach_messages(user_id,lesson_id,question,reply,source,follow_up,supported,created_at) VALUES(?,?,?,?,?,?,?,?)",
    )
    .run(
      "legacy-id",
      "proportions",
      "Question",
      "Reply",
      "Authored",
      "Follow-up",
      1,
      2,
    );
  assert.equal(
    (
      database.prepare("SELECT COUNT(*) AS n FROM coach_messages").get() as {
        n: number;
      }
    ).n,
    1,
  );
  database.close();
  rmSync(dir, { recursive: true, force: true });
});
