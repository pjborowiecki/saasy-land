import { expect, test } from "../fixtures/test"

test("CLI keeps valid choices, command output and clipboard contents in sync", async ({ appPage, page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (value: string) => { document.documentElement.dataset["copiedCommand"] = value } },
    })
  })
  await page.goto("/")
  await appPage.waitForAppReady()
  const cli = page.locator("#cli")
  const command = cli.locator("code").first()
  await expect(command).toContainText("--provider d1")
  await expect(cli.getByRole("button", { name: "Cloudflare D1", exact: true })).toHaveAttribute("aria-pressed", "true")

  await cli.getByRole("tab", { name: "npm", exact: true }).click()
  await expect(command).toContainText("npx saasyland@latest")
  await cli.getByRole("button", { name: "Vercel", exact: true }).click()
  await expect(cli.getByRole("button", { name: "SQLite", exact: true })).toBeDisabled()
  await expect(command).toContainText("--db postgres")
  await expect(command).toContainText("--provider neon")
  await cli.getByRole("button", { name: "Split API", exact: true }).click()
  await expect(command).toContainText("--api hono")

  const store = cli.getByRole("button", { name: "Store with sample products", exact: true })
  await store.click()
  await expect(command).toContainText("--with commerce")
  const billing = cli.locator("dl > div").filter({ has: page.getByText("Billing", { exact: true }) })
  await billing.getByRole("button", { name: "None", exact: true }).click()
  await expect(store).toBeDisabled()
  await expect(command).not.toContainText("--with commerce")
  await cli.getByRole("button", { name: "Monolith", exact: true }).click()
  await expect(command).not.toContainText("--api")

  await cli.getByRole("button", { name: "Copy the command", exact: true }).click()
  await expect(cli.getByRole("button", { name: "Copied", exact: true })).toBeVisible()
  const copied = await page.locator("html").getAttribute("data-copied-command")
  expect(copied).toContain("npx saasyland@latest")
  expect(copied).toContain("--provider neon")
  expect(copied).not.toContain("--with commerce")
  expect(copied).not.toContain("--api")
  await expect(cli.getByRole("button", { name: "Copy the command", exact: true })).toBeVisible()
})

test("hero install command follows the selected package manager", async ({ landingPage, page }) => {
  await landingPage.goto()
  const hero = page.locator("#floor")
  await hero.getByRole("tab", { name: "pnpm", exact: true }).click()
  await expect(hero.locator("code")).toContainText("pnpm dlx saasyland@latest")
  await expect(hero.getByRole("tab", { name: "pnpm", exact: true })).toHaveAttribute("aria-selected", "true")
})

test("foundation shares its hover highlight and clears it when leaving", async ({ landingPage, page }) => {
  await landingPage.goto()
  const cells = page.locator("#foundation .grid.gap-px > div")
  await cells.nth(0).hover()
  await expect(cells.nth(0)).toHaveCSS("z-index", "10")
  await cells.nth(1).hover()
  await expect(cells.nth(1)).toHaveCSS("z-index", "10")
  await expect(cells.nth(0)).toHaveCSS("z-index", "auto")
  await page.locator("#foundation h2").hover()
  await expect(cells.nth(1)).toHaveCSS("z-index", "auto")
})

test("mobile menu closes with Escape and after choosing a section", async ({ landingPage, page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await landingPage.goto()
  await page.getByRole("button", { name: "Open menu", exact: true }).click()
  await expect(page.locator("#landing-mobile-menu")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.locator("#landing-mobile-menu")).not.toBeVisible()
  await page.getByRole("button", { name: "Open menu", exact: true }).click()
  await page.locator("#landing-mobile-menu").getByRole("link", { name: "Foundation", exact: true }).click()
  await expect(page.locator("#landing-mobile-menu")).not.toBeVisible()
  await expect(page).toHaveURL(/#foundation$/u)
})
