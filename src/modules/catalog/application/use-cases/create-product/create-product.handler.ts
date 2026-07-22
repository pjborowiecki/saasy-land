import { toProductDto } from "~/src/modules/catalog/application/dto/product.dto"
import type { CreateProductCommand } from "~/src/modules/catalog/application/use-cases/create-product/create-product.command"
import type { CreateProductResult } from "~/src/modules/catalog/application/use-cases/create-product/create-product.result"
import { Product } from "~/src/modules/catalog/domain/aggregates/product/product.aggregate"
import type { ProductRepository } from "~/src/modules/catalog/domain/repositories/product.repository"
import type { ClockPort } from "~/src/modules/shared-kernel/application/ports/clock.port"
import type { IdGeneratorPort } from "~/src/modules/shared-kernel/application/ports/id-generator.port"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"
import { err, ok } from "~/src/modules/shared-kernel/domain/types/result"
import { Currency } from "~/src/modules/shared-kernel/domain/value-objects/currency"

export interface CreateProductDeps {
  readonly clock: ClockPort
  readonly idGenerator: IdGeneratorPort
  readonly products: ProductRepository
}

export async function createProduct(deps: CreateProductDeps, command: CreateProductCommand): Promise<CreateProductResult> {
  try {
    const product = Product.create({
      ...(command.billingCycle === undefined ? {} : { billingCycle: command.billingCycle }),
      currency: command.currency ?? Currency.DEFAULT_CODE,
      description: command.description,
      id: deps.idGenerator.generate(),
      name: command.name,
      now: deps.clock.now(),
      priceCents: command.priceCents,
      type: command.type,
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
