import { expect, it } from "vite-plus/test"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"
import { I18N } from "~/src/integrations/use-intl/i18n.config"

import { DUMMY_POSTS } from "~/src/data/admin-blog"
import { CLI_CHOICES } from "~/src/data/cli"
import { LEGAL_LINKS, PRODUCT_LINKS } from "~/src/data/marketing-footer"
import { NAV_SECTIONS } from "~/src/data/marketing-navigation"
import { TIERS } from "~/src/data/marketing-pricing"

it("keeps scaffold choices and option identifiers unambiguous", () => {
  expect(new Set(CLI_CHOICES.map((choice) => choice.id)).size).toBe(CLI_CHOICES.length)
  for (const choice of CLI_CHOICES) {
    expect(new Set(choice.options.map((option) => option.id)).size).toBe(choice.options.length)
    for (const option of choice.options) {
      expect(option.flag).toMatch(/^--[a-z0-9-]+(?: [a-z0-9-]+)?$/u)
    }
  }
})
it("provides translated navigation and pricing content in every supported locale", () => {
  for (const locale of I18N.SUPPORTED_LOCALES) {
    const messages = getTestMessages(locale)
    for (const section of NAV_SECTIONS) {
      expect(messages.components.navigation.items[section].length).toBeGreaterThan(0)
    }
    for (const tier of TIERS) {
      expect(messages.pages.landing.pricing.tiers[tier].name.length).toBeGreaterThan(0)
    }
  }
  for (const link of [...LEGAL_LINKS, ...PRODUCT_LINKS]) {
    expect(link.href).toMatch(/^\/(?!\/)/u)
  }
})
it("keeps demo blog records uniquely addressable", () => {
  expect(new Set(DUMMY_POSTS.map((post) => post.id)).size).toBe(DUMMY_POSTS.length)
  for (const post of DUMMY_POSTS) {
    expect(getTestMessages("en-US").pages.admin.blog.demo.posts[post.id].title.length).toBeGreaterThan(0)
    expect(["published", "draft", "scheduled"]).toContain(post.status)
  }
})
