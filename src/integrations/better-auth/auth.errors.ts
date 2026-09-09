export const AUTH_ERRORS = {
  ACCESS_DENIED: "accessDenied",
  ACCOUNT_NOT_FOUND: "accountNotFound",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "credentialAccountNotFound",
  EMAIL_CAN_NOT_BE_UPDATED: "emailCanNotBeUpdated",
  EMAIL_NOT_VERIFIED: "emailNotVerified",
  FAILED_TO_CREATE_SESSION: "failedToCreateSession",
  FAILED_TO_CREATE_USER: "failedToCreateUser",
  FAILED_TO_GET_SESSION: "failedToGetSession",
  FAILED_TO_GET_USER_INFO: "failedToGetUserInfo",
  FAILED_TO_UNLINK_LAST_ACCOUNT: "failedToUnlinkLastAccount",
  FAILED_TO_UPDATE_USER: "failedToUpdateUser",
  ID_TOKEN_NOT_SUPPORTED: "idTokenNotSupported",
  INVALID_EMAIL: "invalidEmail",
  INVALID_EMAIL_OR_PASSWORD: "invalidEmailOrPassword",
  INVALID_PASSWORD: "invalidPassword",
  INVALID_TOKEN: "invalidToken",
  INVITATION_NOT_FOUND: "invitationNotFound",
  PASSWORD_TOO_LONG: "passwordTooLong",
  PASSWORD_TOO_SHORT: "passwordTooShort",
  PROVIDER_NOT_FOUND: "providerNotFound",
  SESSION_EXPIRED: "sessionExpired",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "socialAccountAlreadyLinked",
  UNKNOWN_ERROR: "unknownError",
  USER_ALREADY_EXISTS: "userAlreadyExists",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "userAlreadyExistsUseAnotherEmail",
  USER_ALREADY_HAS_PASSWORD: "userAlreadyHasPassword",
  USER_EMAIL_NOT_FOUND: "userEmailNotFound",
  USER_NOT_FOUND: "userNotFound",
} as const

export type AuthErrorCode = keyof typeof AUTH_ERRORS
export type AuthErrorMessageKey = (typeof AUTH_ERRORS)[AuthErrorCode]

const AUTH_ERROR_BY_CODE = new Map<string, AuthErrorMessageKey>(Object.entries(AUTH_ERRORS))

const readErrorCode = (value: unknown): string | undefined => {
  if (typeof value !== "object" || value === null || !("code" in value)) {
    return undefined
  }

  const { code } = value
  return typeof code === "string" ? code : undefined
}

/** Maps a Better Auth error — client result or thrown `APIError` (code on `body`) — to its i18n key. */
export const authErrorKey = (error: unknown): AuthErrorMessageKey => {
  const body = typeof error === "object" && error !== null && "body" in error ? error.body : undefined
  const code = readErrorCode(error) ?? readErrorCode(body)

  if (code === undefined) {
    return AUTH_ERRORS.UNKNOWN_ERROR
  }

  return AUTH_ERROR_BY_CODE.get(code) ?? AUTH_ERRORS.UNKNOWN_ERROR
}
