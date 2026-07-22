import type { Product } from "~/src/modules/catalog/domain/aggregates/product/product.aggregate"
import type { ProductRepository } from "~/src/modules/catalog/domain/repositories/product.repository"
import type { ProductTypeValue } from "~/src/modules/catalog/domain/value-objects/product-type"
import { toDomain, toPersistence } from "~/src/modules/catalog/infrastructure/persistence/mappers/product.mapper"
import type { ProductRowStore } from "~/src/modules/catalog/infrastructure/persistence/repositories/product-row.store"
import type { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"

export class DrizzleProductRepository implements ProductRepository {
  private readonly store: ProductRowStore

  constructor(store: ProductRowStore) {
    this.store = store
  }

  async findById(id: EntityId): Promise<Product | undefined> {
    const row = await this.store.findById(id.value)
    return row === undefined ? undefined : toDomain(row)
  }

  async list(options?: { readonly type?: ProductTypeValue }): Promise<Product[]> {
    const rows = await this.store.list(options?.type)
    return rows.map((row) => toDomain(row))
  }

  async save(productAggregate: Product): Promise<void> {
    await this.store.upsert(toPersistence(productAggregate))
  }
}
