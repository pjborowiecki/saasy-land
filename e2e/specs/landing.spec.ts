import { expect, test } from "../fixtures/test"

test.describe("landing page", () => {
  test("renders hero, navigation, and primary CTA", async ({ landingPage }) => {
    await landingPage.goto()

    await expect(landingPage.navigation()).toBeVisible()
    await expect(landingPage.heroHeading()).toBeVisible()
    await expect(landingPage.navigationGetStartedLink()).toBeVisible()
    await expect(landingPage.heroGetStartedLink()).toBeVisible()
  })

  test("navbar progress follows scrolling down and back up", async ({ landingPage, page }) => {
    await landingPage.goto()
    const line = landingPage.navigation().locator(':scope > div[aria-hidden="true"]')
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    await page.waitForFunction(() => document.documentElement.scrollHeight > window.innerHeight)

    for (const progress of [0.25, 0.75, 0.1, 0]) {
      await expect
        .poll(async () => {
          await page.evaluate((fraction) => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            window.scrollTo({ behavior: "instant", top: scrollHeight * fraction })
          }, progress)

          return (await line.boundingBox())?.width
        })
        .toBeCloseTo(viewportWidth * progress, -1)
      await expect(line).toHaveCSS("height", "1px")
    }
  })

  test("prefixed locale route renders localized landing page", async ({ landingPage, page }) => {
    await landingPage.goto("/pl")

    await expect(page).toHaveURL(/\/pl-PL\/?$/u)
    await expect(landingPage.heroHeading()).toBeVisible()
    await expect(page.locator("html")).toHaveAttribute("lang", "pl-PL")
    expect(await page.context().cookies()).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "saasyland.com_locale", value: "pl-PL" })]),
    )
  })
})
