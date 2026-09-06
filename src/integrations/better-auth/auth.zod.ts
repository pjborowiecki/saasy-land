import zod from "zod/v4"

import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_SPECIAL_CHAR_PATTERN,
  PASSWORD_UPPERCASE_PATTERN,
} from "~/src/integrations/better-auth/auth.constraints"
import { AUTH_VALIDATION_MESSAGE } from "~/src/integrations/better-auth/auth.validations"

import { MIN_FIELD_LENGTH } from "~/src/modules/_core/utils/zod-fields"

/** A single leading slash, so a redirect target stays on the host the request arrived at. */
const INTERNAL_PATH_PATTERN = /^\/(?!\/)/u

export const emailSchema = zod.email({ message: AUTH_VALIDATION_MESSAGE.emailInvalid }).max(EMAIL_MAX_LENGTH, {
  message: AUTH_VALIDATION_MESSAGE.emailMaxLength,
})

export const nameSchema = zod
  .string()
  .min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.nameRequired })
  .max(NAME_MAX_LENGTH, { message: AUTH_VALIDATION_MESSAGE.nameMaxLength })

export const signInPasswordSchema = zod.string().min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.passwordRequired })

export const strictPasswordSchema = zod
  .string()
  .min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.passwordRequired })
  .min(PASSWORD_MIN_LENGTH, { message: AUTH_VALIDATION_MESSAGE.passwordMinLength })
  .max(PASSWORD_MAX_LENGTH, { message: AUTH_VALIDATION_MESSAGE.passwordMaxLength })
  .refine((value) => PASSWORD_UPPERCASE_PATTERN.test(value), {
    message: AUTH_VALIDATION_MESSAGE.passwordUppercase,
  })
  .refine((value) => PASSWORD_SPECIAL_CHAR_PATTERN.test(value), {
    message: AUTH_VALIDATION_MESSAGE.passwordSpecialCharacter,
  })

export const withMatchingPasswords = <TValue extends zod.ZodType<{ confirmPassword: string; password: string }>>(schema: TValue) =>
  schema.refine((data) => data.password === data.confirmPassword, {
    message: AUTH_VALIDATION_MESSAGE.passwordsMustMatch,
    path: ["confirmPassword"],
  })

const passwordConfirmationSchema = zod.object({
  confirmPassword: zod.string().min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.confirmPasswordRequired }),
  password: strictPasswordSchema,
})

const emailFormSchema = zod.object({
  email: emailSchema,
})

export const signUpWithPasswordSchema = withMatchingPasswords(
  passwordConfirmationSchema.extend({
    callbackURL: zod.string().regex(INTERNAL_PATH_PATTERN).optional(),
    email: emailSchema,
    name: nameSchema,
  }),
)

export const signInWithPasswordSchema = emailFormSchema.extend({
  password: signInPasswordSchema,
})
