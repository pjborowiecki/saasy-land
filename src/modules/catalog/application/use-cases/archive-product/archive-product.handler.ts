import { toProductDto } from "~/src/modules/catalog/application/dto/product.dto"
import type { ArchiveProductCommand } from "~/src/modules/catalog/application/use-cases/archive-product/archive-product.command"
import type { ArchiveProductResult } from "~/src/modules/catalog/application/use-cases/archive-product/archive-product.result"
import type { ProductRepository } from "~/src/modules/catalog/domain/repositories/product.repository"
import type { ClockPort } from "~/src/modules/shared-kernel/application/ports/clock.port"
import { NotFoundError } from "~/src/modules/shared-kernel/domain/errors/not-found.error"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"
import { err, ok } from "~/src/modules/shared-kernel/domain/types/result"
import { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"

export interface ArchiveProductDeps {
  readonly clock: ClockPort
  readonly products: ProductRepository
}

export async function archiveProduct(deps: ArchiveProductDeps, command: ArchiveProductCommand): Promise<ArchiveProductResult> {
  try {
    const product = await deps.products.findById(EntityId.create(command.productId))
    if (product === undefined) {
      return err(new NotFoundError("Product"))
    }
    product.archive(deps.clock.now())
    await deps.products.save(product)
    return ok(toProductDto(product))
  } catch (error) {
    if (error instanceof DomainError) {
      return err(error)
    }
    throw error
  }
}
