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

const AUTH_ERROR_BY_CODE: Record<string, AuthErrorMessageKey> = AUTH_ERRORS

export function authErrorKey(error: unknown): AuthErrorMessageKey {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return AUTH_ERRORS.UNKNOWN_ERROR
  }

  const { code } = error
  if (typeof code !== "string") {
    return AUTH_ERRORS.UNKNOWN_ERROR
  }

  return AUTH_ERROR_BY_CODE[code] ?? AUTH_ERRORS.UNKNOWN_ERROR
}
