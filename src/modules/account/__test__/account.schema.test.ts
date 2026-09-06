import { getTableConfig } from "drizzle-orm/sqlite-core"
import { describe, expect, it } from "vite-plus/test"

import { account, accountRelations } from "~/src/modules/account/account.schema"
import { user } from "~/src/modules/user/user.schema"

describe("account schema", () => {
  it("defines relations and foreign keys", () => {
    expect.hasAssertions()
    const onUpdate = account.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
    expect(getTableConfig(account).foreignKeys[0]?.reference().foreignColumns[0]).toBe(user.id)
    expect(accountRelations).toBeDefined()
  })
})
