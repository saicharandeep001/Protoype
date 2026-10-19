import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
if (Number(process.versions.node.split(".")[0]) < 24) {
  console.error(
    "PeduC requires Node.js 24 or newer. Install Node.js, reopen the terminal, then run npm run local.",
  );
  process.exit(1);
}
const port = process.env.PORT || "3000";
if (!/^\d+$/.test(port) || Number(port) < 1024 || Number(port) > 65535) {
  console.error("PORT must be a number between 1024 and 65535.");
  process.exit(1);
}
const lockHash = createHash("sha256")
  .update(readFileSync(join(root, "package-lock.json")))
  .digest("hex");
const marker = join(root, "node_modules", ".peduc-lock");
if (
  !existsSync(marker) ||
  readFileSync(marker, "utf8") !== lockHash ||
  !existsSync(join(root, "node_modules", "next", "package.json"))
) {
  console.log(
    "Preparing PeduC dependencies from the lockfile. The first setup needs internet access.",
  );
  const installed = spawnSync(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["ci", "--no-fund"],
    { cwd: root, stdio: "inherit", shell: process.platform === "win32" },
  );
  if (installed.status !== 0) process.exit(installed.status || 1);
  writeFileSync(marker, lockHash);
}
if (process.argv.includes("--check")) {
  console.log("PeduC local prerequisites are ready. No server was started.");
  process.exit(0);
}
console.log(
  `\nPeduC is starting. Open http://127.0.0.1:${port}/pilot in your browser.\nChoose “Start a local trial”. No email or API key is required.\nKeep this terminal open; press Ctrl+C to stop.\n`,
);
const child = spawn(
  process.execPath,
  [
    require.resolve("next/dist/bin/next"),
    "dev",
    "--hostname",
    "127.0.0.1",
    "--port",
    port,
  ],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, LOCAL_DEMO_ENABLED: "1", SECURE_COOKIES: "0", NEXT_TELEMETRY_DISABLED: "1" },
  },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
child.on("exit", (code) => process.exit(code ?? 0));
