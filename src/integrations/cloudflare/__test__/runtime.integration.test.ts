import { expect, it } from "vite-plus/test"

import { runtimeResponse } from "~/src/integrations/cloudflare/runtime"
it("reports the Worker runtime through the API root", async () => {
  const response = runtimeResponse()
  expect(response.status).toBe(200)
  await expect(response.json()).resolves.toEqual({ runtime: "cloudflare-workers" })
})
