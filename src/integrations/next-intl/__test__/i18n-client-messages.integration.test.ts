import { SERVER_ONLY_NAMESPACES, toClientMessages } from "~/src/integrations/next-intl/i18n.client-messages"
import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

/**
 * The companion guarantee — that no Client Component reads a withheld namespace — is a
 * repo-wide source scan, so it lives in `scripts/check-i18n.ts` and runs via `bun run check`.
 */
describe("client message narrowing", () => {
  it("drops every server-only namespace from the client tree", () => {
    expect.hasAssertions()

    const clientMessages = toClientMessages(loadLocaleMessagesFromDir("en-US"))

    expect(Object.keys(clientMessages)).toStrictEqual(expect.not.arrayContaining([...SERVER_ONLY_NAMESPACES]))
  })

  it("preserves the namespaces the client still needs", () => {
    expect.hasAssertions()

    const clientMessages = toClientMessages(loadLocaleMessagesFromDir("en-US"))

    expect(clientMessages).toHaveProperty("pages")
    expect(clientMessages).toHaveProperty("auth")
    expect(clientMessages).toHaveProperty("components")
  })

  it("leaves values untouched for the namespaces it keeps", () => {
    expect.hasAssertions()

    const messages = loadLocaleMessagesFromDir("en-US")
    const clientMessages = toClientMessages(messages)

    expect(clientMessages.common).toStrictEqual(messages.common)
  })
})
