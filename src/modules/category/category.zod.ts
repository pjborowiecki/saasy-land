import { createSchemaFactory } from "drizzle-zod"
import zod from "zod/v4"

import { MIN_FIELD_LENGTH, userIdField } from "~/src/modules/_core/utils/zod-fields"
import { category, categoryIconEnum, categoryKindEnum, categoryVisibilityEnum } from "~/src/modules/category/category.schema"
import { CATEGORY_VALIDATION_MESSAGE } from "~/src/modules/category/category.validations"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: zod })

const CATEGORY_NAME_MAX_LENGTH = 255

const categoryIconSchema = zod.enum(categoryIconEnum.enumValues)
const categoryKindSchema = zod.enum(categoryKindEnum.enumValues)
const categoryVisibilitySchema = zod.enum(categoryVisibilityEnum.enumValues)

const categoryIdInput = zod.object({
  categoryId: userIdField,
})

const createCategory = zod.object({
  description: zod.string().optional(),
  icon: categoryIconSchema.optional(),
  kind: categoryKindSchema,
  name: zod
    .string()
    .min(MIN_FIELD_LENGTH, { message: CATEGORY_VALIDATION_MESSAGE.nameRequired })
    .max(CATEGORY_NAME_MAX_LENGTH, { message: CATEGORY_VALIDATION_MESSAGE.nameMaxLength }),
  visibility: categoryVisibilitySchema.optional(),
})

const deleteCategory = categoryIdInput

const getCategory = categoryIdInput

const updateCategory = zod
  .object({
    categoryId: userIdField,
    description: zod.string().optional(),
    icon: categoryIconSchema.optional(),
    kind: categoryKindSchema.optional(),
    name: zod
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
