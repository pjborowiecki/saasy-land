type ValidationTranslator = (key: string, values?: Record<string, string | number>) => string

/** Translate a zod issue message key with optional interpolation params. */
export const translateValidationMessage = (
  message: string,
  t: ValidationTranslator,
  paramsByKey?: Readonly<Record<string, Readonly<Record<string, string | number>>>>,
): string => {
  const params = paramsByKey?.[message]

  return params === undefined ? t(message) : t(message, params)
}
