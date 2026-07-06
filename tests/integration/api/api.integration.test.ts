import { Elysia } from "elysia"

import { createTestRequestUrl } from "~/tests/helpers/test-request"

const HTTP_OK = 200
const apiRoot = new Elysia({ prefix: "/api" }).get("/", "Hello from Saasy Land 2.0!")

describe("api routes", () => {
  it("returns the root api greeting", async () => {
    expect.hasAssertions()

    const response = await apiRoot.handle(new Request(createTestRequestUrl("/api")))

    expect(response.status).toBe(HTTP_OK)
    await expect(response.text()).resolves.toBe("Hello from Saasy Land 2.0!")
  })
})
