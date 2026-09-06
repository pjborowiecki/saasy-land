import { createSchemaFactory } from "drizzle-zod"
import zod from "zod/v4"

import { CURRENCY_CODES } from "~/src/modules/_core/constants/currency"
import { MIN_FIELD_LENGTH, userIdField } from "~/src/modules/_core/utils/zod-fields"
import { product, productStatusEnum, productTypeEnum } from "~/src/modules/product/product.schema"
import { PRODUCT_VALIDATION_MESSAGE } from "~/src/modules/product/product.validations"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: zod })

const PRODUCT_NAME_MAX_LENGTH = 255
const BILLING_CYCLE_MAX_LENGTH = 32

const productStatusSchema = zod.enum(productStatusEnum.enumValues)
const productTypeSchema = zod.enum(productTypeEnum.enumValues)
const currencySchema = zod.enum(CURRENCY_CODES)

const productIdInput = zod.object({
  productId: userIdField,
})

const createProduct = zod.object({
  billingCycle: zod.string().max(BILLING_CYCLE_MAX_LENGTH).optional(),
  currency: currencySchema.optional(),
  description: zod.string().optional(),
  name: zod
    .string()
    .min(MIN_FIELD_LENGTH, { message: PRODUCT_VALIDATION_MESSAGE.nameRequired })
    .max(PRODUCT_NAME_MAX_LENGTH, { message: PRODUCT_VALIDATION_MESSAGE.nameMaxLength }),
  priceCents: zod.number().int().min(0, { message: PRODUCT_VALIDATION_MESSAGE.priceCentsMin }),
  status: productStatusSchema.optional(),
  type: productTypeSchema,
})

const deleteProduct = productIdInput

const getProduct = productIdInput

const updateProduct = zod
  .object({
    billingCycle: zod.string().max(BILLING_CYCLE_MAX_LENGTH).nullable().optional(),
    currency: currencySchema.optional(),
    description: zod.string().optional(),
    name: zod
      .string()
      .min(MIN_FIELD_LENGTH, { message: PRODUCT_VALIDATION_MESSAGE.nameRequired })
      .max(PRODUCT_NAME_MAX_LENGTH, { message: PRODUCT_VALIDATION_MESSAGE.nameMaxLength })
      .optional(),
    priceCents: zod.number().int().min(0, { message: PRODUCT_VALIDATION_MESSAGE.priceCentsMin }).optional(),
    productId: userIdField,
    status: productStatusSchema.optional(),
    type: productTypeSchema.optional(),
  })
  .refine(
    ({ billingCycle, currency, description, name, priceCents, status, type }) =>
      billingCycle !== undefined ||
      currency !== undefined ||
      description !== undefined ||
      name !== undefined ||
      priceCents !== undefined ||
      status !== undefined ||
      type !== undefined,
    { message: PRODUCT_VALIDATION_MESSAGE.atLeastOneFieldRequired },
  )

const insert = createInsertSchema(product)
const select = createSelectSchema(product)
const update = createUpdateSchema(product)

export const productZodSchemas = {
  createProduct,
  deleteProduct,
  getProduct,
  insert,
  select,
  update,
  updateProduct,
}
