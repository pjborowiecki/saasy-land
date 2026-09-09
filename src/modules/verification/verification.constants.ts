export const VERIFICATION_MUTATION_KEYS = {
  REQUEST_PASSWORD_RESET: ["verification", "requestPasswordReset"],
  RESET_PASSWORD: ["verification", "resetPassword"],
  SEND_EMAIL: ["verification", "sendVerificationEmail"],
} as const
