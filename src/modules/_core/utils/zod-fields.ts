import zod from "zod/v4"

export const MIN_FIELD_LENGTH = 1

export const idField = zod.string().min(MIN_FIELD_LENGTH)
