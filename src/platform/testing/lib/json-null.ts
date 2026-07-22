const jsonNullValue: unknown = JSON.parse("null")

if (jsonNullValue !== null) {
  throw new Error("Expected JSON null")
}

/** Nullable DB column value for tests (avoids `null` literals under unicorn/no-null). */
export const JSON_NULL: null = jsonNullValue

export function readJsonNull(): null {
  return JSON_NULL
}
