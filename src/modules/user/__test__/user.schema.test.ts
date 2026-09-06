import { describe, expect, it } from "vite-plus/test"

import { user, userRelations } from "~/src/modules/user/user.schema"

describe("user schema", () => {
  it("defines relations and updatedAt onUpdate", () => {
    expect.hasAssertions()
    const onUpdate = user.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
    expect(userRelations).toBeDefined()
  })
})
