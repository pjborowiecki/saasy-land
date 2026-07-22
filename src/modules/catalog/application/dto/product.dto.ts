import type { Product } from "~/src/modules/catalog/domain/aggregates/product/product.aggregate"

export interface ProductDto {
  readonly billingCycle: string | undefined
  readonly createdAt: string
  readonly currency: string
  readonly description: string
  readonly id: string
  readonly name: string
  readonly priceCents: number
  readonly status: string
  readonly type: string
  readonly updatedAt: string
}

export function toProductDto(product: Product): ProductDto {
  return {
    billingCycle: product.billingCycle,
    createdAt: product.createdAt.toISOString(),
    currency: product.currency.code,
    description: product.description,
    id: product.id.value,
    name: product.name.value,
    priceCents: product.priceCents,
    status: product.status.value,
    type: product.type.value,
    updatedAt: product.updatedAt.toISOString(),
  }
}
