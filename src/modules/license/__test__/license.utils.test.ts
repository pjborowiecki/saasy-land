import { env } from "cloudflare:workers"

import { describe, expect, it } from "vite-plus/test"

import { licenseTierForProduct } from "~/src/modules/license/license.utils"

describe("license.utils", () => {
  it("maps each configured product to its tier", () => {
    expect.hasAssertions()
    expect(licenseTierForProduct(env.POLAR_PRODUCT_ID_CORE)).toBe("core")
    expect(licenseTierForProduct(env.POLAR_PRODUCT_ID_COMPLETE)).toBe("complete")
    expect(licenseTierForProduct(env.POLAR_PRODUCT_ID_AGENCY)).toBe("agency")
  })

  it("refuses a product this app does not sell", () => {
    expect.hasAssertions()
    expect(licenseTierForProduct("00000000-0000-4000-8000-00000000ffff")).toBeUndefined()
  })
})
