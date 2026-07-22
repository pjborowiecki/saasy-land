import { toProductDto } from "~/src/modules/catalog/application/dto/product.dto"
import type { ListProductsQuery } from "~/src/modules/catalog/application/use-cases/list-products/list-products.query"
import type { ListProductsResult } from "~/src/modules/catalog/application/use-cases/list-products/list-products.result"
import type { ProductRepository } from "~/src/modules/catalog/domain/repositories/product.repository"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"
import { err, ok } from "~/src/modules/shared-kernel/domain/types/result"

export interface ListProductsDeps {
  readonly products: ProductRepository
}

export async function listProducts(deps: ListProductsDeps, query: ListProductsQuery = {}): Promise<ListProductsResult> {
  try {
    const products = await deps.products.list(query.type === undefined ? {} : { type: query.type })
    return ok(products.map((product) => toProductDto(product)))
  } catch (error) {
    if (error instanceof DomainError) {
      return err(error)
    }
    throw error
  }
}
