import z from "zod/v4"

import { MIN_FIELD_LENGTH } from "~/src/modules/_core/utils/zod-fields"

import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_SPECIAL_CHAR_PATTERN,
  PASSWORD_UPPERCASE_PATTERN,
} from "~/src/integrations/better-auth/auth.constraints"
import { AUTH_VALIDATION_MESSAGE } from "~/src/integrations/better-auth/auth.validations"

export const emailSchema = z.email({ message: AUTH_VALIDATION_MESSAGE.emailInvalid }).max(EMAIL_MAX_LENGTH, {
  message: AUTH_VALIDATION_MESSAGE.emailMaxLength,
})

export const nameSchema = z
  .string()
  .min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.nameRequired })
  .max(NAME_MAX_LENGTH, { message: AUTH_VALIDATION_MESSAGE.nameMaxLength })

export const signInPasswordSchema = z.string().min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.passwordRequired })

export const strictPasswordSchema = z
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

export function withMatchingPasswords<T extends z.ZodType<{ confirmPassword: string; password: string }>>(schema: T) {
  return schema.refine((data) => data.password === data.confirmPassword, {
    message: AUTH_VALIDATION_MESSAGE.passwordsMustMatch,
    path: ["confirmPassword"],
  })
}

const passwordConfirmationSchema = z.object({
  confirmPassword: z.string().min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.confirmPasswordRequired }),
  password: strictPasswordSchema,
})

const emailFormSchema = z.object({
  email: emailSchema,
})

export const signUpWithPasswordSchema = withMatchingPasswords(
  passwordConfirmationSchema.extend({
    callbackURL: z.url().optional(),
    email: emailSchema,
    name: nameSchema,
  }),
)

export const signInWithPasswordSchema = emailFormSchema.extend({
  password: signInPasswordSchema,
})
