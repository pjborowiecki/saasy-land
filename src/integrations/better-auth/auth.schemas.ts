import z from "zod/v4"

type AuthSchemaTranslator = (key: string, params?: Record<string, string | number>) => string

const EMAIL_MAX_LENGTH = 64
const NAME_MAX_LENGTH = 32
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 1024
const MIN_FIELD_LENGTH = 1

export const emailSchema = (t: AuthSchemaTranslator) =>
  z.email({ message: t("auth.validations.emailInvalid") }).max(EMAIL_MAX_LENGTH, {
    message: t("auth.validations.emailMaxLength", { max: EMAIL_MAX_LENGTH }),
  })

const nameSchema = (t: AuthSchemaTranslator) =>
  z
    .string()
    .min(MIN_FIELD_LENGTH, { message: t("auth.validations.nameRequired") })
    .max(NAME_MAX_LENGTH, { message: t("auth.validations.nameMaxLength", { max: NAME_MAX_LENGTH }) })

const strictPasswordSchema = (t: AuthSchemaTranslator) =>
  z
    .string()
    .min(MIN_FIELD_LENGTH, { message: t("auth.validations.passwordRequired") })
    .min(PASSWORD_MIN_LENGTH, { message: t("auth.validations.passwordMinLength", { min: PASSWORD_MIN_LENGTH }) })
    .max(PASSWORD_MAX_LENGTH, { message: t("auth.validations.passwordMaxLength", { max: PASSWORD_MAX_LENGTH }) })
    .refine((value) => /[A-Z]/u.test(value), {
      message: t("auth.validations.passwordUppercase"),
    })
    .refine((value) => /[^A-Za-z0-9]/u.test(value), {
      message: t("auth.validations.passwordSpecialCharacter"),
    })

const signInPasswordSchema = (t: AuthSchemaTranslator) =>
  z.string().min(MIN_FIELD_LENGTH, { message: t("auth.validations.passwordRequired") })

const passwordConfirmationShape = (t: AuthSchemaTranslator) => ({
  confirmPassword: z.string().min(MIN_FIELD_LENGTH, { message: t("auth.validations.confirmPasswordRequired") }),
  password: strictPasswordSchema(t),
})

const passwordConfirmationSchema = (t: AuthSchemaTranslator) => z.object(passwordConfirmationShape(t))

const withMatchingPasswords = <T extends z.ZodType<{ confirmPassword: string; password: string }>>(schema: T, t: AuthSchemaTranslator) =>
  schema.refine((data) => data.password === data.confirmPassword, {
    message: t("auth.validations.passwordsMustMatch"),
    path: ["confirmPassword"],
  })

const emailFormSchema = (t: AuthSchemaTranslator) =>
  z.object({
    email: emailSchema(t),
  })

export const signUpWithPasswordSchema = (t: AuthSchemaTranslator) =>
  withMatchingPasswords(
    passwordConfirmationSchema(t).extend({
      email: emailSchema(t),
      name: nameSchema(t),
    }),
    t,
  )

export const signInWithPasswordSchema = (t: AuthSchemaTranslator) =>
  emailFormSchema(t).extend({
    password: signInPasswordSchema(t),
  })

export const forgotPasswordSchema = emailFormSchema

export const resetPasswordSchema = (t: AuthSchemaTranslator) => withMatchingPasswords(passwordConfirmationSchema(t), t)
