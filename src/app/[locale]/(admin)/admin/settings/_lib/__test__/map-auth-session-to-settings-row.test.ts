import type { AuthActiveSession } from "~/src/integrations/better-auth/auth.types"

import { mapAuthActiveSessionToSettingsRow } from "~/src/app/[locale]/(admin)/admin/settings/_lib/map-auth-session-to-settings-row"

const SESSION_ID = "01900000-0000-7000-8000-000000000001"
const CURRENT_SESSION_ID = "01900000-0000-7000-8000-000000000002"
const SESSION_TOKEN = "session-token-abc"
const NOW = new Date("2026-07-22T12:00:00.000Z")

function makeSession(overrides: Partial<AuthActiveSession> = {}): AuthActiveSession {
  return {
    createdAt: new Date("2026-07-20T12:00:00.000Z"),
    expiresAt: new Date("2026-08-20T12:00:00.000Z"),
    id: SESSION_ID,
    ipAddress: "203.0.113.10",
    token: SESSION_TOKEN,
    updatedAt: new Date("2026-07-22T11:30:00.000Z"),
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
    userId: "01900000-0000-7000-8000-000000000099",
    ...overrides,
  }
}

describe("map auth active session to settings row", () => {
  it("marks the current session and omits relative time", () => {
    expect.hasAssertions()

    expect(mapAuthActiveSessionToSettingsRow(makeSession({ id: CURRENT_SESSION_ID }), CURRENT_SESSION_ID, NOW)).toMatchObject({
      device: "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
      icon: "laptop",
      ip: "203.0.113.10",
      isCurrent: true,
      location: "Unknown location",
      token: SESSION_TOKEN,
    })
  })

  it("maps mobile user agents and relative active time", () => {
    expect.hasAssertions()

    expect(
      mapAuthActiveSessionToSettingsRow(
        makeSession({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" }),
        CURRENT_SESSION_ID,
        NOW,
      ),
    ).toMatchObject({
      icon: "smartphone",
      isCurrent: false,
      time: "30 min",
    })
  })

  it("falls back to ip address and unknown device label", () => {
    expect.hasAssertions()

    expect(mapAuthActiveSessionToSettingsRow(makeSession({ ipAddress: "198.51.100.4", userAgent: "" }), undefined, NOW)).toMatchObject({
      device: "198.51.100.4",
      icon: "laptop",
      isCurrent: false,
    })
  })
})
