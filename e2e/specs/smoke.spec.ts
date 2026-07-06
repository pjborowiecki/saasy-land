import { expect, test } from "../fixtures/test"

test.describe("smoke", () => {
  test("home renders on default locale without prefix", async ({ landingPage, page }) => {
    await landingPage.goto()

    await expect(page, "should land on root URL without prefix").toHaveURL(/.*\/$/u)
    await expect(landingPage.heroHeading()).toBeVisible()
  })
})
