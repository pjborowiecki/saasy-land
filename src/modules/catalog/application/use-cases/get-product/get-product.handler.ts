import { toProductDto } from "~/src/modules/catalog/application/dto/product.dto"
import type { GetProductQuery } from "~/src/modules/catalog/application/use-cases/get-product/get-product.query"
import type { GetProductResult } from "~/src/modules/catalog/application/use-cases/get-product/get-product.result"
import type { ProductRepository } from "~/src/modules/catalog/domain/repositories/product.repository"
import { NotFoundError } from "~/src/modules/shared-kernel/domain/errors/not-found.error"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"
import { err, ok } from "~/src/modules/shared-kernel/domain/types/result"
import { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"

export interface GetProductDeps {
  readonly products: ProductRepository
}

export async function getProduct(deps: GetProductDeps, query: GetProductQuery): Promise<GetProductResult> {
  try {
    const product = await deps.products.findById(EntityId.create(query.productId))
    if (product === undefined) {
      return err(new NotFoundError("Product"))
    }
    return ok(toProductDto(product))
  } catch (error) {
    if (error instanceof DomainError) {
      return err(error)
    }
    throw error
  }
}
