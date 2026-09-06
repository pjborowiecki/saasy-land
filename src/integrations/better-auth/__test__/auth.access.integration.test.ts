import { describe, expect, it } from "vite-plus/test"

import {
  createAuthTestInstance,
  createTestUserPayload,
  findAuthTestUser,
  getExtendedAuthApi,
  getSessionUserRole,
  promoteUserToAdmin,
  requireSessionUserId,
  signUpVerifyAndSignIn,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.test-instance"
import { DEFAULT_ROLE_CODE, ROLE_CODES } from "~/src/integrations/better-auth/auth.access"

const authContext = await createAuthTestInstance()
const authApi = getExtendedAuthApi(authContext)

describe("auth.access integration", () => {
  it("assigns customer role by default after verification", async () => {
    expect.hasAssertions()
    const { headers } = await signUpVerifyAndSignIn(authContext)

    await expect(getSessionUserRole(authContext, headers)).resolves.toBe(DEFAULT_ROLE_CODE)
  })

  it("allows admins to manage products through Better Auth permission checks", async () => {
    expect.hasAssertions()
    const adminUser = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, adminUser)

    await promoteUserToAdmin(authContext, await requireSessionUserId(authContext, headers))

    const permission = await authApi.userHasPermission({
      body: {
        permissions: { product: ["create"] },
        role: ROLE_CODES.ADMIN,
      },
      headers,
    })

    expect(permission.success).toBe(true)
  })

  it("denies customers product mutations through Better Auth permission checks", async () => {
    expect.hasAssertions()
    const customer = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, customer)

    const permission = await authApi.userHasPermission({
      body: {
        permissions: { product: ["create"] },
        role: ROLE_CODES.CUSTOMER,
      },
      headers,
    })

    expect(permission.success).toBe(false)
  })

  it("lets admins change another user's role", async () => {
    expect.hasAssertions()
    const adminUser = createTestUserPayload()
    const targetUser = createTestUserPayload()

    const adminSession = await signUpVerifyAndSignIn(authContext, adminUser)

    await promoteUserToAdmin(authContext, await requireSessionUserId(authContext, adminSession.headers))

    await signUpVerifyAndSignIn(authContext, targetUser)

    const target = await findAuthTestUser(authContext, targetUser.email)

    await authApi.setRole({
      body: {
        role: ROLE_CODES.ADMIN,
        userId: target.id,
      },
      headers: adminSession.headers,
    })

    const updated = await findAuthTestUser(authContext, targetUser.email)

    expect(updated.role).toBe(ROLE_CODES.ADMIN)
  })
})
