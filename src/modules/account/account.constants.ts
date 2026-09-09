export const ACCOUNT_MUTATION_KEYS = {
  CHANGE_EMAIL: ["account", "settingsChangeEmail"],
  CHANGE_PASSWORD: ["account", "settingsChangePassword"],
  SIGN_OUT: ["account", "settingsSignOutUser"],
  SIGN_UP_WITH_PASSWORD: ["account", "signUpWithPassword"],
  UPDATE_USER: ["account", "settingsUpdateUser"],
} as const
