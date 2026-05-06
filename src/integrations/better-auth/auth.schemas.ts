import z from "zod/v4"

export const emailSchema = (t: (key: string, params?: Record<string, string | number>) => string) => {
  return z.email({ message: t("auth.validations.emailInvalid") }).max(64, { message: t("auth.validations.emailMaxLength", { max: 64 }) })
}

export const signUpWithPasswordSchema = (t: (key: string, params?: Record<string, string | number>) => string) =>
  z
    .object({
      name: z
        .string()
        .min(1, { message: t("auth.validations.nameRequired") })
        .max(32, { message: t("auth.validations.nameMaxLength", { max: 32 }) }),
      email: emailSchema(t),
      password: z
        .string()
        .min(1, { message: t("auth.validations.passwordRequired") })
        .min(8, { message: t("auth.validations.passwordMinLength", { min: 8 }) })
        .max(1024, { message: t("auth.validations.passwordMaxLength", { max: 1024 }) })
        .refine((val) => /[A-Z]/.test(val), {
          message: t("auth.validations.passwordUppercase"),
        })
        .refine((val) => /[^A-Za-z0-9]/.test(val), {
          message: t("auth.validations.passwordSpecialCharacter"),
        }),
      confirmPassword: z.string().min(1, { message: t("auth.validations.confirmPasswordRequired") }),
    })
    .refine((schema) => schema.password === schema.confirmPassword, {
      message: t("auth.validations.passwordsMustMatch"),
      path: ["confirmPassword"],
    })

export const signInWithPasswordSchema = (t: (key: string, params?: Record<string, string | number>) => string) =>
  z.object({
    email: emailSchema(t),
    password: z.string().min(1, { message: t("auth.validations.passwordRequired") }),
  })
