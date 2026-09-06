/** The portion of a TanStack string field used by our presentation components. */
export interface StringField {
  readonly name: string
  readonly state: {
    readonly value: string
    readonly meta: { readonly errors: readonly unknown[]; readonly isTouched?: boolean }
  }
  handleBlur: () => void
  handleChange: (value: string) => void
}

export const fieldErrorMessage = (errors: readonly unknown[]): string | undefined => {
  const [error] = errors
  if (typeof error === "string") {
    return error
  }
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message
  }
  return undefined
}
