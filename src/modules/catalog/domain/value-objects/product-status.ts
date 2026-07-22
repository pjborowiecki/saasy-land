import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

const STATUSES = ["draft", "published", "archived"] as const
export type ProductStatusValue = (typeof STATUSES)[number]

function isProductStatus(value: string): value is ProductStatusValue {
  return (STATUSES as readonly string[]).includes(value)
}

export class ProductStatus {
  readonly value: ProductStatusValue

  private constructor(value: ProductStatusValue) {
    this.value = value
  }

  static create(value: string): ProductStatus {
    if (!isProductStatus(value)) {
      throw new DomainError("VALIDATION", `Invalid product status: ${value}`)
    }
    return new ProductStatus(value)
  }

  static draft(): ProductStatus {
    return new ProductStatus("draft")
  }

  isPublished(): boolean {
    return this.value === "published"
  }

  isArchived(): boolean {
    return this.value === "archived"
  }
}
