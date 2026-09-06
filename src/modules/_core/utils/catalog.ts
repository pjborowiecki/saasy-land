/** Asserts a catalog produced at least one code — required by Drizzle `pgEnum` and similar APIs. */
export const nonEmptyTuple = <TValue>(values: readonly TValue[]): [TValue, ...TValue[]] => {
  const [first, ...rest] = values
  if (first === undefined) {
    throw new Error("Catalog must not be empty")
  }
  return [first, ...rest]
}
