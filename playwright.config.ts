import { defineConfig, devices } from "@playwright/test"

const isCI = Boolean(process.env["CI"])
const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://127.0.0.1:3000"
const CI_RETRIES = 2
const DEV_RETRIES = 0
const CI_WORKERS = 2

export default defineConfig({
  forbidOnly: isCI,
  fullyParallel: true,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "on-failure" }]],
  retries: isCI ? CI_RETRIES : DEV_RETRIES,
  testDir: "./e2e",
  use: {
    baseURL: appUrl,
    screenshot: "only-on-failure",
    trace: isCI ? "on-first-retry" : "retain-on-failure",
    video: isCI ? "retain-on-failure" : "off",
  },
  webServer: {
    command: isCI ? "bun run start" : "bun run dev -- --port 3000",
    reuseExistingServer: !isCI,
    timeout: 120_000,
    url: appUrl,
  },
  ...(isCI ? { workers: CI_WORKERS } : {}),
})
