import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { MIN_FIELD_LENGTH, userIdField } from "~/src/modules/_core/utils/zod-fields"
import { category, categoryIconEnum, categoryKindEnum, categoryVisibilityEnum } from "~/src/modules/category/category.schema"
import { CATEGORY_VALIDATION_MESSAGE } from "~/src/modules/category/category.validations"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

const CATEGORY_NAME_MAX_LENGTH = 255

const categoryIconSchema = z.enum(categoryIconEnum.enumValues)
const categoryKindSchema = z.enum(categoryKindEnum.enumValues)
const categoryVisibilitySchema = z.enum(categoryVisibilityEnum.enumValues)

const categoryIdInput = z.object({
  categoryId: userIdField,
})

const createCategory = z.object({
  description: z.string().optional(),
  icon: categoryIconSchema.optional(),
  kind: categoryKindSchema,
  name: z
    .string()
    .min(MIN_FIELD_LENGTH, { message: CATEGORY_VALIDATION_MESSAGE.nameRequired })
    .max(CATEGORY_NAME_MAX_LENGTH, { message: CATEGORY_VALIDATION_MESSAGE.nameMaxLength }),
  visibility: categoryVisibilitySchema.optional(),
})

const deleteCategory = categoryIdInput

const getCategory = categoryIdInput

const updateCategory = z
  .object({
    categoryId: userIdField,
    description: z.string().optional(),
    icon: categoryIconSchema.optional(),
    kind: categoryKindSchema.optional(),
    name: z
      .string()
      .min(MIN_FIELD_LENGTH, { message: CATEGORY_VALIDATION_MESSAGE.nameRequired })
      .max(CATEGORY_NAME_MAX_LENGTH, { message: CATEGORY_VALIDATION_MESSAGE.nameMaxLength })
      .optional(),
    visibility: categoryVisibilitySchema.optional(),
  })
  .refine(
    ({ description, icon, kind, name, visibility }) =>
      description !== undefined || icon !== undefined || kind !== undefined || name !== undefined || visibility !== undefined,
    { message: CATEGORY_VALIDATION_MESSAGE.atLeastOneFieldRequired },
  )

const insert = createInsertSchema(category)
const select = createSelectSchema(category)
const update = createUpdateSchema(category)

export const categoryZodSchemas = {
  createCategory,
  deleteCategory,
  getCategory,
  insert,
  select,
  update,
  updateCategory,
}
