export const PRODUCT_QUERY_KEYS = {
  ALL: ["product"],
  LIST: ["product", "getProducts"],
} as const

export const PRODUCT_MUTATION_KEYS = {
  CREATE: ["product", "createProduct"],
  DELETE: ["product", "deleteProduct"],
  UPDATE: ["product", "updateProduct"],
} as const
