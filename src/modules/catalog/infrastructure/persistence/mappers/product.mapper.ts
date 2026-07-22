import { Product } from "~/src/modules/catalog/domain/aggregates/product/product.aggregate"
import { ProductStatus } from "~/src/modules/catalog/domain/value-objects/product-status"
import { ProductType } from "~/src/modules/catalog/domain/value-objects/product-type"
import type { ProductInsert, ProductRow } from "~/src/modules/catalog/infrastructure/persistence/schema/product.table"
import { Currency } from "~/src/modules/shared-kernel/domain/value-objects/currency"
import { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"
import { NonEmptyString } from "~/src/modules/shared-kernel/domain/value-objects/non-empty-string"

export function toDomain(row: ProductRow): Product {
  return Product.reconstitute({
    billingCycle: typeof row.billingCycle === "string" && row.billingCycle.length > 0 ? row.billingCycle : undefined,
    createdAt: row.createdAt,
    currency: Currency.create(row.currency),
    description: row.description,
    id: EntityId.create(row.id),
    name: NonEmptyString.create(row.name, "name"),
    priceCents: row.priceCents,
    status: ProductStatus.create(row.status),
    type: ProductType.create(row.type),
    updatedAt: row.updatedAt,
  })
}

export function toPersistence(productAggregate: Product): ProductInsert {
  return {
    billingCycle: productAggregate.billingCycle,
    createdAt: productAggregate.createdAt,
    currency: productAggregate.currency.code,
    description: productAggregate.description,
    id: productAggregate.id.value,
    name: productAggregate.name.value,
    priceCents: productAggregate.priceCents,
    status: productAggregate.status.value,
    type: productAggregate.type.value,
    updatedAt: productAggregate.updatedAt,
  }
}
