import z from "zod/v4"

export const MIN_FIELD_LENGTH = 1

export const userIdField = z.string().min(MIN_FIELD_LENGTH)
