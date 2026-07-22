import type { SQL } from "drizzle-orm"

import { Product } from "~/src/modules/catalog/domain/aggregates/product/product.aggregate"
import {
  createDrizzleProductRepository,
  createDrizzleProductRowStore,
  createNeonProductSqlGateway,
  type ProductDatabase,
  type ProductSqlGateway,
} from "~/src/modules/catalog/infrastructure/persistence/repositories/create-drizzle-product-repository"
import { DrizzleProductRepository } from "~/src/modules/catalog/infrastructure/persistence/repositories/drizzle-product.repository"
import type { ProductRowStore } from "~/src/modules/catalog/infrastructure/persistence/repositories/product-row.store"
import { product, type ProductInsert, type ProductRow } from "~/src/modules/catalog/infrastructure/persistence/schema/product.table"
import { Currency } from "~/src/modules/shared-kernel/domain/value-objects/currency"
import { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"

const NOW = new Date("2026-07-21T12:00:00.000Z")
const PRODUCT_ID = "01900000-0000-7000-8000-000000000001"
const PRICE_CENTS = 1000
const SINGLE_ITEM_COUNT = 1
const NOT_FOUND_INDEX = -1
const MISSING_ROW: ProductRow | undefined = undefined

function makeRow(): ProductRow {
  return {
    billingCycle: "month",
    createdAt: NOW,
    currency: Currency.DEFAULT_CODE,
    description: "Desc",
    id: PRODUCT_ID,
    name: "Kit",
    priceCents: PRICE_CENTS,
    status: "draft",
    type: "one_time",
    updatedAt: NOW,
  }
}

function createMemoryStore(seed: ProductRow[] = []): ProductRowStore {
  const rows = [...seed]
  return {
    findById(id) {
      return Promise.resolve(rows.find((row) => row.id === id) ?? MISSING_ROW)
    },
    list(type) {
      return Promise.resolve(type === undefined ? rows : rows.filter((row) => row.type === type))
    },
    upsert(row) {
      const index = rows.findIndex((existing) => existing.id === row.id)
      const next: ProductRow = {
        billingCycle: row.billingCycle ?? "",
        createdAt: row.createdAt ?? NOW,
        currency: row.currency ?? Currency.DEFAULT_CODE,
        description: row.description ?? "",
        id: row.id ?? PRODUCT_ID,
        name: row.name ?? "Kit",
        priceCents: row.priceCents ?? 0,
        status: row.status ?? "draft",
        type: row.type ?? "one_time",
        updatedAt: row.updatedAt ?? NOW,
      }
      if (index === NOT_FOUND_INDEX) {
        rows.push(next)
      } else {
        rows[index] = next
      }
      return Promise.resolve()
    },
  }
}

function createGateway(rows: ProductRow[]): ProductSqlGateway {
  return {
    findByIdRows: () => Promise.resolve(rows),
    listRows: (type) => Promise.resolve(type === undefined ? rows : rows.filter((row) => row.type === type)),
    upsertRow: () => Promise.resolve(),
  }
}

function createFakeProductDatabase(rows: ProductRow[]): ProductDatabase {
  const limited = () =>
    Object.assign(Promise.resolve(rows), {
      limit: (_count: number) => Promise.resolve(rows),
    })

  const query = () =>
    Object.assign(Promise.resolve(rows), {
      where: (_condition: SQL) => limited(),
    })

  const onConflictDoUpdate = vi.fn<() => Promise<void>>(() => Promise.resolve())
  const values = vi.fn<(row: ProductInsert) => { onConflictDoUpdate: typeof onConflictDoUpdate }>(() => ({
    onConflictDoUpdate,
  }))
  const insert = vi.fn<(table: typeof product) => { values: typeof values }>(() => ({ values }))
  const from = vi.fn<(table: typeof product) => ReturnType<typeof query>>(() => query())
  const select = vi.fn<() => { from: typeof from }>(() => ({ from }))

  return { insert, select }
}

describe("drizzle product repository", () => {
  it("finds by id when a row exists", async () => {
    expect.hasAssertions()
    const repository = new DrizzleProductRepository(createMemoryStore([makeRow()]))
    await expect(repository.findById(EntityId.create(PRODUCT_ID))).resolves.toMatchObject({
      id: { value: PRODUCT_ID },
    })
  })

  it("returns undefined when no row exists", async () => {
    expect.hasAssertions()
    const repository = new DrizzleProductRepository(createMemoryStore())
    await expect(repository.findById(EntityId.create(PRODUCT_ID))).resolves.toBeUndefined()
  })

  it("lists all products", async () => {
    expect.hasAssertions()
    const repository = new DrizzleProductRepository(createMemoryStore([makeRow()]))
    await expect(repository.list()).resolves.toHaveLength(SINGLE_ITEM_COUNT)
  })

  it("lists products filtered by type", async () => {
    expect.hasAssertions()
    const repository = new DrizzleProductRepository(createMemoryStore([makeRow()]))
    await expect(repository.list({ type: "one_time" })).resolves.toHaveLength(SINGLE_ITEM_COUNT)
  })

  it("saves through the row store", async () => {
    expect.hasAssertions()
    const store = createMemoryStore()
    const repository = new DrizzleProductRepository(store)
    const aggregate = Product.create({
      currency: Currency.DEFAULT_CODE,
      description: "Desc",
      id: PRODUCT_ID,
      name: "Kit",
      now: NOW,
      priceCents: PRICE_CENTS,
      type: "one_time",
    })

    await repository.save(aggregate)
    await expect(store.findById(PRODUCT_ID)).resolves.toMatchObject({ id: PRODUCT_ID, name: "Kit" })
  })
})

describe("drizzle product row store", () => {
  it("finds a row by id", async () => {
    expect.hasAssertions()
    const store = createDrizzleProductRowStore(createGateway([makeRow()]))
    await expect(store.findById(PRODUCT_ID)).resolves.toMatchObject({ id: PRODUCT_ID })
  })

  it("returns undefined when findById has no rows", async () => {
    expect.hasAssertions()
    const store = createDrizzleProductRowStore(createGateway([]))
    await expect(store.findById(PRODUCT_ID)).resolves.toBeUndefined()
  })

  it("lists all rows and filters by type", async () => {
    expect.hasAssertions()
    const store = createDrizzleProductRowStore(createGateway([makeRow()]))
    await expect(store.list()).resolves.toHaveLength(SINGLE_ITEM_COUNT)
    await expect(store.list("one_time")).resolves.toHaveLength(SINGLE_ITEM_COUNT)
  })

  it("upserts through the sql gateway", async () => {
    expect.hasAssertions()
    const upsertRow = vi.fn<(row: ProductInsert) => Promise<void>>(() => Promise.resolve())
    const store = createDrizzleProductRowStore({
      findByIdRows: () => Promise.resolve([]),
      listRows: () => Promise.resolve([]),
      upsertRow,
    })
    const row: ProductInsert = {
      billingCycle: "month",
      createdAt: NOW,
      currency: Currency.DEFAULT_CODE,
      description: "Desc",
      id: PRODUCT_ID,
      name: "Kit",
      priceCents: PRICE_CENTS,
      status: "draft",
      type: "one_time",
      updatedAt: NOW,
    }
    await store.upsert(row)
    expect(upsertRow).toHaveBeenCalledWith(row)
  })
})

describe("neon product sql gateway", () => {
  it("loads rows through the product database", async () => {
    expect.hasAssertions()
    const database = createFakeProductDatabase([makeRow()])
    const gateway = createNeonProductSqlGateway(database)

    await expect(gateway.findByIdRows(PRODUCT_ID)).resolves.toHaveLength(SINGLE_ITEM_COUNT)
    await expect(gateway.listRows()).resolves.toHaveLength(SINGLE_ITEM_COUNT)
    await expect(gateway.listRows("one_time")).resolves.toHaveLength(SINGLE_ITEM_COUNT)
  })

  it("upserts through the product database", async () => {
    expect.hasAssertions()
    const database = createFakeProductDatabase([makeRow()])
    const gateway = createNeonProductSqlGateway(database)
    const row: ProductInsert = {
      billingCycle: "month",
      createdAt: NOW,
      currency: Currency.DEFAULT_CODE,
      description: "Desc",
      id: PRODUCT_ID,
      name: "Kit",
      priceCents: PRICE_CENTS,
      status: "draft",
      type: "one_time",
      updatedAt: NOW,
    }

    await gateway.upsertRow(row)
    expect(vi.mocked(database.insert)).toHaveBeenCalledWith(product)
  })
})

describe("create drizzle product repository", () => {
  it("wires neon gateway into the repository", async () => {
    expect.hasAssertions()
    const repository = createDrizzleProductRepository(createFakeProductDatabase([makeRow()]))
    await expect(repository.findById(EntityId.create(PRODUCT_ID))).resolves.toMatchObject({
      id: { value: PRODUCT_ID },
    })
  })
})
