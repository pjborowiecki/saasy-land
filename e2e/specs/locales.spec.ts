import { readFileSync } from "node:fs"

import { expect, test } from "../fixtures/test"

const locales = ["en-US", "de-DE", "es-ES", "fr-FR", "it-IT", "ja-JP", "pl-PL", "pt-BR", "uk-UA"] as const
const legalPages = ["privacy", "terms", "refunds", "licence"] as const

for (const locale of locales) {
  const prefix = locale === "en-US" ? "" : `/${locale}`
  test(`${locale}: canonical language, mobile layout, and all legal documents`, async ({ appPage, page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${locale.split("-")[0]}`)
    await appPage.waitForAppReady()
    await expect(page).toHaveURL(new RegExp(`${prefix}/?$`, "u"))
    await expect(page.locator("html")).toHaveAttribute("lang", locale)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    const localeSwitch = page.locator('footer [data-testid="locale-switch"]')
    await expect(localeSwitch).toHaveCount(1)
    await localeSwitch.getByRole("button").click()
    await expect(page.getByRole("option")).toHaveCount(locales.length)
    await expect(page.getByRole("option", { selected: true })).toHaveCount(1)
    await page.keyboard.press("Escape")
    for (const slug of legalPages) {
      const messages = JSON.parse(readFileSync(`messages/${locale}/pages.legal.${slug}.json`, "utf8")) as { title: string }
      await page.locator(`footer a[href="${prefix}/${slug}"]`).click()
      await expect(page).toHaveURL(new RegExp(`${prefix}/${slug}$`, "u"))
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(messages.title)
      await expect(page.locator("html")).toHaveAttribute("lang", locale)
      await expect(page.locator('head link[rel="alternate"][hreflang]')).toHaveCount(locales.length + 1)
    }
    expect(errors).toEqual([])
  })

  test(`${locale}: localized docs and blog retain their language after navigation`, async ({ appPage, page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    await page.goto(`${prefix}/docs/getting-started`)
    await appPage.waitForAppReady()
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await page.locator(`a[href="${prefix}/docs/getting-started/installation"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`${prefix}/docs/getting-started/installation$`, "u"))
    await expect(page.locator("html")).toHaveAttribute("lang", locale)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await page.goto(`${prefix}/blog`)
    await appPage.waitForAppReady()
    await page.locator(`main a[href^="${prefix}/blog/"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`${prefix}/blog/.+`, "u"))
    await expect(page.locator("html")).toHaveAttribute("lang", locale)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('head link[rel="alternate"][hreflang]')).toHaveCount(locales.length + 1)
    expect(errors).toEqual([])
  })
}
