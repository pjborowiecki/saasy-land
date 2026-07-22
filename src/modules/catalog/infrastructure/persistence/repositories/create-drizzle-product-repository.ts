import { eq, type SQL } from "drizzle-orm"

import type { ProductRepository } from "~/src/modules/catalog/domain/repositories/product.repository"
import type { ProductTypeValue } from "~/src/modules/catalog/domain/value-objects/product-type"
import { DrizzleProductRepository } from "~/src/modules/catalog/infrastructure/persistence/repositories/drizzle-product.repository"
import type { ProductRowStore } from "~/src/modules/catalog/infrastructure/persistence/repositories/product-row.store"
import { product, type ProductInsert, type ProductRow } from "~/src/modules/catalog/infrastructure/persistence/schema/product.table"

const SINGLE_ROW_LIMIT = 1

/**
 * Narrow DB surface for product persistence.
 * Real Neon `db` and unit-test doubles both satisfy this structurally.
 */
export interface ProductDatabase {
  insert: (table: typeof product) => {
    values: (row: ProductInsert) => {
      onConflictDoUpdate: (config: {
        set: {
          billingCycle: ProductInsert["billingCycle"]
          currency: ProductInsert["currency"]
          description: ProductInsert["description"]
          name: ProductInsert["name"]
          priceCents: ProductInsert["priceCents"]
          status: ProductInsert["status"]
          type: ProductInsert["type"]
          updatedAt: ProductInsert["updatedAt"]
        }
        target: typeof product.id
      }) => PromiseLike<unknown>
    }
  }
  select: () => {
    from: (table: typeof product) => ProductSelectFrom
  }
}

interface ProductSelectFrom extends PromiseLike<ProductRow[]> {
  where: (condition: SQL) => ProductSelectWhere
}

interface ProductSelectWhere extends PromiseLike<ProductRow[]> {
  limit: (count: number) => PromiseLike<ProductRow[]>
}

/** Row-level SQL port — unit-tested without the Drizzle fluent builder. */
export interface ProductSqlGateway {
  findByIdRows: (id: string) => PromiseLike<ProductRow[]>
  listRows: (type?: ProductTypeValue) => PromiseLike<ProductRow[]>
  upsertRow: (row: ProductInsert) => PromiseLike<unknown>
}

export function createDrizzleProductRowStore(gateway: ProductSqlGateway): ProductRowStore {
  return {
    async findById(id) {
      const rows = await gateway.findByIdRows(id)
      const [row] = rows
      return row
    },
    list(type?: ProductTypeValue) {
      return Promise.resolve(gateway.listRows(type))
    },
    async upsert(row: ProductInsert) {
      await gateway.upsertRow(row)
    },
  }
}

export function createNeonProductSqlGateway(database: ProductDatabase): ProductSqlGateway {
  return {
    findByIdRows: (id) => database.select().from(product).where(eq(product.id, id)).limit(SINGLE_ROW_LIMIT),
    listRows: (type) =>
      type === undefined ? database.select().from(product) : database.select().from(product).where(eq(product.type, type)),
    upsertRow: (row) =>
      database
        .insert(product)
        .values(row)
        .onConflictDoUpdate({
          set: {
            billingCycle: row.billingCycle,
            currency: row.currency,
            description: row.description,
            name: row.name,
            priceCents: row.priceCents,
            status: row.status,
            type: row.type,
            updatedAt: row.updatedAt,
          },
          target: product.id,
        }),
  }
}

export function createDrizzleProductRepository(database: ProductDatabase): ProductRepository {
  return new DrizzleProductRepository(createDrizzleProductRowStore(createNeonProductSqlGateway(database)))
}
