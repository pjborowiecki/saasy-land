export const SESSION_QUERY_KEYS = {
  ACTIVE: ["session", "getActiveSessions"],
  ALL: ["session"],
  CURRENT: ["session", "getCurrentSession"],
  USER: ["session", "listUserSessions"],
} as const

export const SESSION_MUTATION_KEYS = {
  REVOKE: ["session", "settingsRevokeSession"],
  REVOKE_OTHER: ["session", "settingsRevokeOtherSessions"],
  REVOKE_USER: ["session", "revokeUserSession"],
  REVOKE_USER_SESSIONS: ["session", "revokeUserSessions"],
} as const
