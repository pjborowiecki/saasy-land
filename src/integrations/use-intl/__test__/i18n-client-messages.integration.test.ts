import { describe, expect, it } from "vite-plus/test"

import { ROOT_NAMESPACES, buildMessageTree, loadNamespace } from "~/src/integrations/use-intl/i18n.messages"

describe("route message selection", () => {
  it("keeps email namespaces out of the shared browser tree", () => {
    expect(ROOT_NAMESPACES.some((namespace) => namespace.startsWith("emails"))).toBe(false)
    expect(() => loadNamespace({ locale: "en-US", namespace: "emails" })).toThrow("No messages/en-US/emails.json")
    expect(() => loadNamespace({ locale: "en-US", namespace: "emails.newsletter" })).toThrow("No messages/en-US/emails.newsletter.json")
  })
  it("does not mutate a source namespace when constructing the tree", () => {
    const common = Object.freeze({ title: "Shared" })
    expect(buildMessageTree([["common", common]])).toEqual({ common })
    expect(common).toEqual({ title: "Shared" })
  })
  it("loads all shared component namespaces", () => {
    expect(ROOT_NAMESPACES).toContain("common")
    expect(ROOT_NAMESPACES.some((namespace) => namespace.startsWith("components."))).toBe(true)
  })
  it("leaves strings untouched within a selected namespace", async () => {
    const common = await loadNamespace({ locale: "en-US", namespace: "common" })
    expect(buildMessageTree([["common", common]])["common"]).toEqual(common)
  })
  it("does not include unrelated page namespaces", async () => {
    const page = await loadNamespace({ locale: "en-US", namespace: "pages.landing" })
    const tree = buildMessageTree([["pages.landing", page]])
    expect(tree).not.toHaveProperty("pages.admin")
    expect(tree).not.toHaveProperty("emails")
  })
})
