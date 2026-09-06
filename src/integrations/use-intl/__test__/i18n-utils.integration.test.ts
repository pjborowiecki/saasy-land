import { QueryClient } from "@tanstack/react-query"
import { describe, expect, it } from "vite-plus/test"

import { buildMessageTree, loadNamespace, messagesQueryOptions, preloadNamespaces } from "~/src/integrations/use-intl/i18n.messages"

describe("bundled locale namespaces", () => {
  it("rejects missing namespace files", () => {
    expect(() => loadNamespace({ locale: "en-US", namespace: "missing" })).toThrow("No messages/en-US/missing.json")
  })
  it("reports the locale in missing namespace errors", () => {
    expect(() => loadNamespace({ locale: "pl-PL", namespace: "missing" })).toThrow("No messages/pl-PL/missing.json")
  })
  it("loads independently of the filesystem working directory", async () => {
    expect(await loadNamespace({ locale: "en-US", namespace: "auth.form" })).toHaveProperty("placeholders.email")
  })
  it("builds nested namespace paths", () => {
    expect(buildMessageTree([["pages.auth.sign-in", { title: "Sign in" }]])).toEqual({
      pages: { auth: { "sign-in": { title: "Sign in" } } },
    })
  })
  it("merges parent and child namespaces without mutating imported messages", () => {
    const parent = { title: "Admin" }
    expect(
      buildMessageTree([
        ["pages.admin", parent],
        ["pages.admin.users", { title: "Users" }],
      ]),
    ).toEqual({ pages: { admin: { title: "Admin", users: { title: "Users" } } } })
    expect(
      buildMessageTree([
        ["pages.admin.users", { title: "Users" }],
        ["pages.admin", parent],
      ]),
    ).toEqual({ pages: { admin: { title: "Admin", users: { title: "Users" } } } })
    expect(parent).toEqual({ title: "Admin" })
  })
  it("includes locale and namespace in query cache identity", () => {
    expect(messagesQueryOptions({ locale: "en-US", namespace: "auth.form" }).queryKey).not.toEqual(
      messagesQueryOptions({ locale: "pl-PL", namespace: "auth.form" }).queryKey,
    )
  })
  it("preloads messages into the same cache used by the provider", async () => {
    const queryClient = new QueryClient()
    await preloadNamespaces({ locale: "en-US", namespaces: ["auth.form"], queryClient })
    expect(queryClient.getQueryData(messagesQueryOptions({ locale: "en-US", namespace: "auth.form" }).queryKey)).toHaveProperty(
      "placeholderPassword",
    )
  })
})
