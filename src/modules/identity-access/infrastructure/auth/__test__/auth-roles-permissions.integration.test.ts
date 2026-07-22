import { PERMISSIONS } from "~/src/modules/identity-access/domain/permissions"
import {
  createAuthTestInstance,
  createTestUserPayload,
  findAuthTestUser,
  getExtendedAuthApi,
  getSessionUserRole,
  promoteUserToAdmin,
  requireSessionUserId,
  signUpVerifyAndSignIn,
} from "~/src/modules/identity-access/infrastructure/auth/__test__/auth-test-instance"
import { canAccess } from "~/src/modules/identity-access/infrastructure/auth/auth.access"

const authContext = await createAuthTestInstance()
const authApi = getExtendedAuthApi(authContext)

describe("auth roles and permissions", () => {
  it("assigns customer role by default after verification", async () => {
    expect.hasAssertions()
    const { headers } = await signUpVerifyAndSignIn(authContext)

    await expect(getSessionUserRole(authContext, headers)).resolves.toBe(PERMISSIONS.DEFAULT_ROLE)
  })

  it("allows admins to manage products through Better Auth permission checks", async () => {
    expect.hasAssertions()
    const adminUser = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, adminUser)

    await promoteUserToAdmin(authContext, await requireSessionUserId(authContext, headers))

    const permission = await authApi.userHasPermission({
      body: {
        permissions: { product: ["create"] },
        role: PERMISSIONS.ROLES.ADMIN,
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
        role: PERMISSIONS.ROLES.CUSTOMER,
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
        role: PERMISSIONS.ROLES.ADMIN,
        userId: target.id,
      },
      headers: adminSession.headers,
    })

    const updated = await findAuthTestUser(authContext, targetUser.email)

    expect(updated.role).toBe(PERMISSIONS.ROLES.ADMIN)
  })
})

describe("app permission helpers", () => {
  it("matches Better Auth admin grants for product creation", () => {
    expect.hasAssertions()
    expect(canAccess(PERMISSIONS.ROLES.ADMIN, { product: ["create"] })).toBe(true)
    expect(canAccess(PERMISSIONS.ROLES.CUSTOMER, { product: ["create"] })).toBe(false)
  })

  it("matches Better Auth admin grants for order refunds and settings management", () => {
    expect.hasAssertions()
    expect(canAccess(PERMISSIONS.ROLES.ADMIN, { order: ["refund"] })).toBe(true)
    expect(canAccess(PERMISSIONS.ROLES.CUSTOMER, { order: ["refund"] })).toBe(false)
    expect(canAccess(PERMISSIONS.ROLES.ADMIN, { settings: ["manage"] })).toBe(true)
    expect(canAccess(PERMISSIONS.ROLES.CUSTOMER, { settings: ["manage"] })).toBe(false)
  })
})
