export const USER_QUERY_KEYS = {
  ALL: ["user"],
  LIST: ["user", "getUsers"],
} as const

export const USER_MUTATION_KEYS = {
  BAN: ["user", "banUser"],
  CREATE: ["user", "createUser"],
  DELETE: ["user", "deleteUser"],
  IMPERSONATE: ["user", "impersonateUser"],
  SET_PASSWORD: ["user", "setUserPassword"],
  SET_ROLE: ["user", "setUserRole"],
  STOP_IMPERSONATING: ["user", "stopImpersonatingUser"],
  UNBAN: ["user", "unbanUser"],
  UPDATE: ["user", "updateUser"],
} as const
