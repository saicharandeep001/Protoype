import { defineConfig } from "@playwright/test";
process.env.CBC_E2E_DATABASE_PATH ??= `/tmp/context-e2e-${Date.now()}.sqlite`;
process.env.DATABASE_PATH = process.env.CBC_E2E_DATABASE_PATH;
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    browserName: "chromium",
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- --port 3100",
    url: "http://127.0.0.1:3100/api/health",
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      DATABASE_PATH: process.env.DATABASE_PATH,
      SECURE_COOKIES: "0",
      LOCAL_DEMO_ENABLED: "1",
    },
  },
});
