export type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly error: E; readonly ok: false }

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

export function err<E>(error: E): Result<never, E> {
  return { error, ok: false }
}
