import { defineConfig, devices } from "@playwright/test"

const isCI = !!process.env.CI

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "on-failure" }]],
  use: {
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000",
    trace: isCI ? "on-first-retry" : "retain-on-failure",
    video: isCI ? "retain-on-failure" : "off",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: isCI ? "bun run start" : "bun run dev -- --port 3000",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000",
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
})
