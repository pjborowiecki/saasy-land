export const AUTH_FORM_IDS = {
  FORGOT_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
  TWO_FACTOR: "two-factor",
  VERIFY_EMAIL: "verify-email",
} as const

export type AuthFormId = (typeof AUTH_FORM_IDS)[keyof typeof AUTH_FORM_IDS]
