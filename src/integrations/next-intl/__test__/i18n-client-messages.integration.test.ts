import { SERVER_ONLY_NAMESPACES, toClientMessages } from "~/src/integrations/next-intl/i18n.client-messages"
import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

/**
 * The companion guarantee — that no Client Component reads a withheld namespace — is a
 * repo-wide source scan, so it lives in `scripts/check-i18n.ts` and runs via `bun run check`.
 */

function resolveMessagePath(tree: unknown, path: string): unknown {
  let node: unknown = tree

  for (const segment of path.split(".")) {
    node = typeof node === "object" && node !== null ? Reflect.get(node, segment) : undefined
  }

  return node
}

describe("client message narrowing", () => {
  it("drops every server-only message path from the client tree", () => {
    expect.hasAssertions()

    const clientMessages: Record<string, unknown> = toClientMessages(loadLocaleMessagesFromDir("en-US"))

    for (const namespace of SERVER_ONLY_NAMESPACES) {
      expect(resolveMessagePath(clientMessages, namespace)).toBeUndefined()
    }
  })

  it("does not mutate the server-side message tree", () => {
    expect.hasAssertions()

    const messages = loadLocaleMessagesFromDir("en-US")
    toClientMessages(messages)

    expect(messages.pages).toHaveProperty("landing")
    expect(messages).toHaveProperty("emails")
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

  it("tolerates trees that do not contain a pruned path", () => {
    expect.hasAssertions()

    const clientMessages = toClientMessages({ pages: { admin: "collapsed" } })

    expect(clientMessages).toStrictEqual({ pages: { admin: "collapsed" } })
  })
})
