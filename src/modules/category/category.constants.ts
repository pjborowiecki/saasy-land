export const CATEGORY_QUERY_KEYS = {
  ALL: ["category"],
  LIST: ["category", "getCategories"],
} as const

export const CATEGORY_MUTATION_KEYS = {
  CREATE: ["category", "createCategory"],
  DELETE: ["category", "deleteCategory"],
  UPDATE: ["category", "updateCategory"],
} as const
