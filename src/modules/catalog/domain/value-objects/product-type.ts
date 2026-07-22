import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

const TYPES = ["one_time", "subscription", "course"] as const
export type ProductTypeValue = (typeof TYPES)[number]

function isProductType(value: string): value is ProductTypeValue {
  return (TYPES as readonly string[]).includes(value)
}

export class ProductType {
  readonly value: ProductTypeValue

  private constructor(value: ProductTypeValue) {
    this.value = value
  }

  static create(value: string): ProductType {
    if (!isProductType(value)) {
      throw new DomainError("VALIDATION", `Invalid product type: ${value}`)
    }
    return new ProductType(value)
  }
}
