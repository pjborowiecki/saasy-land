import { toProductDto } from "~/src/modules/catalog/application/dto/product.dto"
import type { UpdateProductCommand } from "~/src/modules/catalog/application/use-cases/update-product/update-product.command"
import type { UpdateProductResult } from "~/src/modules/catalog/application/use-cases/update-product/update-product.result"
import type { ProductRepository } from "~/src/modules/catalog/domain/repositories/product.repository"
import type { ClockPort } from "~/src/modules/shared-kernel/application/ports/clock.port"
import { NotFoundError } from "~/src/modules/shared-kernel/domain/errors/not-found.error"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"
import { err, ok } from "~/src/modules/shared-kernel/domain/types/result"
import { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"

export interface UpdateProductDeps {
  readonly clock: ClockPort
  readonly products: ProductRepository
}

export async function updateProduct(deps: UpdateProductDeps, command: UpdateProductCommand): Promise<UpdateProductResult> {
  try {
    const product = await deps.products.findById(EntityId.create(command.productId))
    if (product === undefined) {
      return err(new NotFoundError("Product"))
    }
    product.update({
      ...(command.billingCycle === undefined ? {} : { billingCycle: command.billingCycle }),
      ...(command.currency === undefined ? {} : { currency: command.currency }),
      ...(command.description === undefined ? {} : { description: command.description }),
      ...(command.name === undefined ? {} : { name: command.name }),
      now: deps.clock.now(),
      ...(command.priceCents === undefined ? {} : { priceCents: command.priceCents }),
    })
    await deps.products.save(product)
    return ok(toProductDto(product))
  } catch (error) {
    if (error instanceof DomainError) {
      return err(error)
    }
    throw error
  }
}
