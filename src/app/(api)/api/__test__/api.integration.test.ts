import { Elysia } from "elysia"

import { createTestRequestUrl } from "~/src/platform/testing/lib/test-request"

const HTTP_OK = 200
const runtimeVersions = {
  bun: process.versions.bun ?? "unavailable",
  node: process.versions.node,
}
const apiRoot = new Elysia({ prefix: "/api" }).get("/", () => Response.json(runtimeVersions))

describe("api routes", () => {
  it("returns runtime versions at the api root", async () => {
    expect.hasAssertions()

    const response = await apiRoot.handle(new Request(createTestRequestUrl("/api")))

    expect(response.status).toBe(HTTP_OK)
    await expect(response.json()).resolves.toStrictEqual(runtimeVersions)
  })
})
