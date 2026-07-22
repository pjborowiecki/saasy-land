import { getTableConfig } from "drizzle-orm/pg-core"

import { session, sessionRelations } from "~/src/modules/session/session.schema"
import { user } from "~/src/modules/user/user.schema"

describe("session schema", () => {
  it("defines relations and foreign keys", () => {
    expect.hasAssertions()
    const onUpdate = session.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
    expect(getTableConfig(session).foreignKeys[0]?.reference().foreignColumns[0]).toBe(user.id)
    expect(sessionRelations).toBeDefined()
  })
})
