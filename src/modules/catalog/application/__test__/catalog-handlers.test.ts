import { toProductDto } from "~/src/modules/catalog/application/dto/product.dto"
import { archiveProduct } from "~/src/modules/catalog/application/use-cases/archive-product/archive-product.handler"
import { createProduct } from "~/src/modules/catalog/application/use-cases/create-product/create-product.handler"
import { getProduct } from "~/src/modules/catalog/application/use-cases/get-product/get-product.handler"
import { listProducts } from "~/src/modules/catalog/application/use-cases/list-products/list-products.handler"
import { updateProduct } from "~/src/modules/catalog/application/use-cases/update-product/update-product.handler"
import { Product } from "~/src/modules/catalog/domain/aggregates/product/product.aggregate"
import type { ProductRepository } from "~/src/modules/catalog/domain/repositories/product.repository"
import type { ProductTypeValue } from "~/src/modules/catalog/domain/value-objects/product-type"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"
import { Currency } from "~/src/modules/shared-kernel/domain/value-objects/currency"
import { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"

const NOW = new Date("2026-07-21T12:00:00.000Z")
const PRODUCT_ID = "01900000-0000-7000-8000-000000000001"
const COURSE_ID = "01900000-0000-7000-8000-000000000002"
const PRICE_CENTS = 1000
const CREATED_PRICE_CENTS = 2000
const UPDATED_PRICE_CENTS = 3000
const COURSE_PRICE_CENTS = 5000
const MISSING_PRODUCT: Product | undefined = undefined

function createDraftProduct(): Product {
  return Product.create({
    currency: Currency.DEFAULT_CODE,
    description: "Desc",
    id: PRODUCT_ID,
    name: "Kit",
    now: NOW,
    priceCents: PRICE_CENTS,
    type: "one_time",
  })
}

function createMemoryProducts(seed: Product[] = []): ProductRepository {
  const byId = new Map(seed.map((product) => [product.id.value, product]))

  return {
    findById(id: EntityId) {
      return Promise.resolve(byId.get(id.value))
    },
    list(options?: { readonly type?: ProductTypeValue }) {
      const all = [...byId.values()]
      return Promise.resolve(options?.type === undefined ? all : all.filter((product) => product.type.value === options.type))
    },
    save(product: Product) {
      byId.set(product.id.value, product)
      return Promise.resolve()
    },
  }
}

function failingProducts(overrides: Partial<ProductRepository>): ProductRepository {
  return {
    findById: () => Promise.resolve(MISSING_PRODUCT),
    list: () => Promise.resolve([]),
    save: () => Promise.resolve(),
    ...overrides,
  }
}

describe("catalog helpers", () => {
  it("maps a product to a dto", () => {
    expect.hasAssertions()
    expect(toProductDto(createDraftProduct())).toMatchObject({
      id: PRODUCT_ID,
      name: "Kit",
      priceCents: PRICE_CENTS,
      status: "draft",
      type: "one_time",
    })
  })
})

describe("create product handler", () => {
  it("creates and persists a product", async () => {
    expect.hasAssertions()
    const products = createMemoryProducts()
    await expect(
      createProduct(
        {
          clock: { now: () => NOW },
          idGenerator: { generate: () => PRODUCT_ID },
          products,
        },
        {
          billingCycle: "month",
          description: "New",
          name: "Created",
          priceCents: CREATED_PRICE_CENTS,
          type: "subscription",
        },
      ),
    ).resolves.toMatchObject({
      ok: true,
      value: { billingCycle: "month", name: "Created" },
    })
    await expect(products.findById(EntityId.create(PRODUCT_ID))).resolves.toBeDefined()
  })

  it("returns domain errors from invalid input", async () => {
    expect.hasAssertions()
    await expect(
      createProduct(
        {
          clock: { now: () => NOW },
          idGenerator: { generate: () => PRODUCT_ID },
          products: createMemoryProducts(),
        },
        {
          description: "x",
          name: "Bad",
          priceCents: -1,
          type: "one_time",
        },
      ),
    ).resolves.toMatchObject({ ok: false })
  })

  it("rethrows unexpected errors", async () => {
    expect.hasAssertions()
    const boom = new Error("db down")
    await expect(
      createProduct(
        {
          clock: { now: () => NOW },
          idGenerator: { generate: () => PRODUCT_ID },
          products: failingProducts({
            save: () => Promise.reject(boom),
          }),
        },
        {
          description: "x",
          name: "Ok",
          priceCents: 1,
          type: "one_time",
        },
      ),
    ).rejects.toThrow(boom)
  })
})

describe("get product handler", () => {
  it("returns a product when found", async () => {
    expect.hasAssertions()
    const product = createDraftProduct()
    const products = createMemoryProducts([product])
    await expect(getProduct({ products }, { productId: PRODUCT_ID })).resolves.toMatchObject({
      ok: true,
      value: { id: PRODUCT_ID },
    })
  })

  it("returns not-found when missing", async () => {
    expect.hasAssertions()
    await expect(getProduct({ products: createMemoryProducts() }, { productId: PRODUCT_ID })).resolves.toMatchObject({
      ok: false,
    })
  })

  it("returns domain errors from the repository", async () => {
    expect.hasAssertions()
    await expect(
      getProduct(
        {
          products: failingProducts({
            findById: () => Promise.reject(new DomainError("VALIDATION", "bad id")),
          }),
        },
        { productId: PRODUCT_ID },
      ),
    ).resolves.toMatchObject({ ok: false })
  })

  it("rethrows unexpected errors", async () => {
    expect.hasAssertions()
    const boom = new Error("boom")
    await expect(
      getProduct(
        {
          products: failingProducts({
            findById: () => Promise.reject(boom),
          }),
        },
        { productId: PRODUCT_ID },
      ),
    ).rejects.toThrow(boom)
  })
})

describe("list products handler", () => {
  it("lists all products", async () => {
    expect.hasAssertions()
    const products = createMemoryProducts([
      createDraftProduct(),
      Product.create({
        currency: Currency.DEFAULT_CODE,
        description: "Course",
        id: COURSE_ID,
        name: "Course",
        now: NOW,
        priceCents: COURSE_PRICE_CENTS,
        type: "course",
      }),
    ])

    await expect(listProducts({ products })).resolves.toMatchObject({
      ok: true,
      value: [{ type: "one_time" }, { type: "course" }],
    })
  })

  it("filters products by type", async () => {
    expect.hasAssertions()
    const products = createMemoryProducts([
      createDraftProduct(),
      Product.create({
        currency: Currency.DEFAULT_CODE,
        description: "Course",
        id: COURSE_ID,
        name: "Course",
        now: NOW,
        priceCents: COURSE_PRICE_CENTS,
        type: "course",
      }),
    ])

    await expect(listProducts({ products }, { type: "course" })).resolves.toMatchObject({
      ok: true,
      value: [{ type: "course" }],
    })
  })

  it("returns domain errors from the repository", async () => {
    expect.hasAssertions()
    await expect(
      listProducts({
        products: failingProducts({
          list: () => Promise.reject(new DomainError("VALIDATION", "bad filter")),
        }),
      }),
    ).resolves.toMatchObject({ ok: false })
  })

  it("rethrows unexpected errors", async () => {
    expect.hasAssertions()
    const boom = new Error("boom")
    await expect(
      listProducts({
        products: failingProducts({
          list: () => Promise.reject(boom),
        }),
      }),
    ).rejects.toThrow(boom)
  })
})

describe("update product handler", () => {
  it("updates a product", async () => {
    expect.hasAssertions()
    const product = createDraftProduct()
    const products = createMemoryProducts([product])
    await expect(
      updateProduct(
        { clock: { now: () => NOW }, products },
        {
          billingCycle: "year",
          currency: "EUR",
          description: "Updated",
          name: "Updated Kit",
          priceCents: UPDATED_PRICE_CENTS,
          productId: PRODUCT_ID,
        },
      ),
    ).resolves.toMatchObject({
      ok: true,
      value: { currency: "EUR", name: "Updated Kit" },
    })
  })

  it("updates a product when optional fields are omitted", async () => {
    expect.hasAssertions()
    const product = createDraftProduct()
    const products = createMemoryProducts([product])
    await expect(updateProduct({ clock: { now: () => NOW }, products }, { productId: PRODUCT_ID })).resolves.toMatchObject({
      ok: true,
      value: { name: "Kit", priceCents: PRICE_CENTS },
    })
  })

  it("returns not-found when missing", async () => {
    expect.hasAssertions()
    await expect(
      updateProduct({ clock: { now: () => NOW }, products: createMemoryProducts() }, { name: "Nope", productId: PRODUCT_ID }),
    ).resolves.toMatchObject({ ok: false })
  })

  it("returns domain errors for archived products", async () => {
    expect.hasAssertions()
    const archived = createDraftProduct()
    archived.archive(NOW)
    await expect(
      updateProduct({ clock: { now: () => NOW }, products: createMemoryProducts([archived]) }, { name: "Nope", productId: PRODUCT_ID }),
    ).resolves.toMatchObject({ ok: false })
  })

  it("rethrows unexpected errors", async () => {
    expect.hasAssertions()
    const boom = new Error("boom")
    await expect(
      updateProduct(
        {
          clock: { now: () => NOW },
          products: failingProducts({
            findById: () => Promise.reject(boom),
          }),
        },
        { productId: PRODUCT_ID },
      ),
    ).rejects.toThrow(boom)
  })
})

describe("archive product handler", () => {
  it("archives a product", async () => {
    expect.hasAssertions()
    const product = createDraftProduct()
    const products = createMemoryProducts([product])
    await expect(archiveProduct({ clock: { now: () => NOW }, products }, { productId: PRODUCT_ID })).resolves.toMatchObject({
      ok: true,
      value: { status: "archived" },
    })
  })

  it("returns not-found when missing", async () => {
    expect.hasAssertions()
    await expect(
      archiveProduct({ clock: { now: () => NOW }, products: createMemoryProducts() }, { productId: PRODUCT_ID }),
    ).resolves.toMatchObject({ ok: false })
  })

  it("returns domain errors when already archived", async () => {
    expect.hasAssertions()
    const archived = createDraftProduct()
    archived.archive(NOW)
    await expect(
      archiveProduct({ clock: { now: () => NOW }, products: createMemoryProducts([archived]) }, { productId: PRODUCT_ID }),
    ).resolves.toMatchObject({ ok: false })
  })

  it("rethrows unexpected errors", async () => {
    expect.hasAssertions()
    const boom = new Error("boom")
    await expect(
      archiveProduct(
        {
          clock: { now: () => NOW },
          products: failingProducts({
            findById: () => Promise.reject(boom),
          }),
        },
        { productId: PRODUCT_ID },
      ),
    ).rejects.toThrow(boom)
  })
})
