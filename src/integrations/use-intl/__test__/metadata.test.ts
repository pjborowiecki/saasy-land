import { QueryClient } from "@tanstack/react-query"
import { getRequest } from "@tanstack/react-start/server"
import { beforeEach, expect, it, vi } from "vite-plus/test"

import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { buildMessageTree, loadNamespace } from "~/src/integrations/use-intl/i18n.messages"
import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { APP_NAME } from "~/src/presentation/branding"

beforeEach(() => vi.mocked(getRequest).mockReturnValue(new Request("http://localhost/")))
it("selects the most specific metadata namespace before its parent", async () => {
  const result = await loadRouteMessages({
    metadataNamespace: "pages.admin.products",
    namespaces: ["pages.admin", "pages.admin.products"],
    pathname: "/admin/products",
    queryClient: new QueryClient(),
  })
  expect(result.metadata.title).toContain("Products")
  expect(result.metadata.description).toContain("merchandise")
})
it("resolves nested metadata inside a namespace", async () => {
  const result = await loadRouteMessages({
    metadataNamespace: "pages.newsletter.confirm",
    namespaces: ["pages.newsletter"],
    pathname: "/newsletter/confirm",
    queryClient: new QueryClient(),
  })
  expect(result.metadata.title).toBe("Confirm your subscription")
})
it("uses application defaults for a layout without page metadata", async () => {
  const result = await loadRouteMessages({ metadataNamespace: undefined, namespaces: [], pathname: "/", queryClient: new QueryClient() })
  expect(result.metadata).toMatchObject({ description: "", locale: "en-US", title: APP_NAME })
  expect(routeHead({ loaderData: result })).toHaveProperty("meta")
})
it("supports metadata namespaces that are not needed by the page's components", async () => {
  const result = await loadRouteMessages({
    metadataNamespace: "pages.admin.products",
    namespaces: [],
    pathname: "/admin/products",
    queryClient: new QueryClient(),
  })
  expect(result.metadata.title).toContain("Products")
})
it("uses safe defaults for an absent metadata subsection", async () => {
  const result = await loadRouteMessages({
    metadataNamespace: "pages.newsletter.unknown",
    namespaces: ["pages.newsletter"],
    pathname: "/",
    queryClient: new QueryClient(),
  })
  expect(result.metadata).toMatchObject({ description: "", title: APP_NAME })
})
it("produces localized canonical and alternate links", async () => {
  vi.mocked(getRequest).mockReturnValue(new Request("http://localhost/pl-PL/docs"))
  const result = await loadRouteMessages({
    metadataNamespace: undefined,
    namespaces: [],
    pathname: "/docs",
    queryClient: new QueryClient(),
  })
  expect(routeHead({ loaderData: result }).links?.find((link) => link.rel === "canonical")?.href).toContain("/pl-PL/docs")
  expect(routeHead({})).toEqual({})
})
it("merges sibling namespaces without discarding shared parents", () => {
  expect(
    buildMessageTree([
      ["pages.first", { title: "First" }],
      ["pages.second", { title: "Second" }],
    ]),
  ).toEqual({ pages: { first: { title: "First" }, second: { title: "Second" } } })
})

it("formats titles once, including titles already containing the application name", () => {
  for (const [title, expected] of [
    ["Products", `Products | ${APP_NAME}`],
    [`Products | ${APP_NAME}`, `Products | ${APP_NAME}`],
    [APP_NAME, APP_NAME],
  ] as const) {
    const head = routeHead({ loaderData: { metadata: { description: "Description", locale: "en-US", pathname: "/", title } } })
    expect(head.meta?.[0]).toEqual({ title: expected })
  }
})
it("loads every browser namespace through the lazy registry in every locale", async () => {
  const paths = Object.keys(import.meta.glob("../../../../messages/en-US/*.json")).filter((path) => !path.includes("/emails."))
  expect(paths.length).toBeGreaterThan(0)
  await Promise.all(
    paths.map(async (path) => {
      const namespace = path.slice(path.lastIndexOf("/") + 1, -".json".length)
      for (const locale of I18N.SUPPORTED_LOCALES) {
        const messages = await loadNamespace({ locale, namespace })
        expect(messages).toBeTypeOf("object")
        expect(Object.keys(messages).length).toBeGreaterThan(0)
      }
    }),
  )
})
it("uses the default locale for native server functions without a cookie", async () => {
  vi.mocked(getRequest).mockReturnValue(new Request("http://localhost/_serverFn/example"))
  const result = await loadRouteMessages({ metadataNamespace: undefined, namespaces: [], pathname: "/", queryClient: new QueryClient() })
  expect(result.metadata.locale).toBe("en-US")
})
