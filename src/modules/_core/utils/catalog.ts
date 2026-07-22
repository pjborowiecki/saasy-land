/** Asserts a catalog produced at least one code — required by Drizzle `pgEnum` and similar APIs. */
export function nonEmptyTuple<T>(values: readonly T[]): [T, ...T[]] {
  const [first, ...rest] = values
  if (first === undefined) {
    throw new Error("Catalog must not be empty")
  }
  return [first, ...rest]
}
