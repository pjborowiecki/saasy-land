import { ProductAlreadyArchivedError } from "~/src/modules/catalog/domain/errors/product-already-archived.error"
import { ProductNotPublishableError } from "~/src/modules/catalog/domain/errors/product-not-publishable.error"
import { ProductStatus } from "~/src/modules/catalog/domain/value-objects/product-status"
import { ProductType } from "~/src/modules/catalog/domain/value-objects/product-type"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"
import { createDomainEvent, type DomainEvent } from "~/src/modules/shared-kernel/domain/types/domain-event"
import { Currency } from "~/src/modules/shared-kernel/domain/value-objects/currency"
import { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"
import { NonEmptyString } from "~/src/modules/shared-kernel/domain/value-objects/non-empty-string"

export interface ProductProps {
  readonly billingCycle: string | undefined
  readonly createdAt: Date
  readonly currency: Currency
  readonly description: string
  readonly id: EntityId
  readonly name: NonEmptyString
  readonly priceCents: number
  readonly status: ProductStatus
  readonly type: ProductType
  readonly updatedAt: Date
}

function assertPriceCents(priceCents: number): void {
  if (!Number.isInteger(priceCents) || priceCents < 0) {
    throw new DomainError("VALIDATION", "Price must be a non-negative integer in minor units")
  }
}

export class Product {
  private events: DomainEvent[] = []
  private props: ProductProps

  private constructor(props: ProductProps) {
    this.props = props
  }

  static create(input: {
    readonly billingCycle?: string
    readonly currency: string
    readonly description: string
    readonly id: string
    readonly name: string
    readonly now: Date
    readonly priceCents: number
    readonly type: string
  }): Product {
    assertPriceCents(input.priceCents)
    const product = new Product({
      billingCycle: input.billingCycle,
      createdAt: input.now,
      currency: Currency.create(input.currency),
      description: input.description.trim(),
      id: EntityId.create(input.id),
      name: NonEmptyString.create(input.name, "name"),
      priceCents: input.priceCents,
      status: ProductStatus.draft(),
      type: ProductType.create(input.type),
      updatedAt: input.now,
    })
    product.events.push(createDomainEvent("catalog.product.created", { productId: product.id.value }, input.now))
    return product
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(props)
  }

  get id(): EntityId {
    return this.props.id
  }

  get name(): NonEmptyString {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get status(): ProductStatus {
    return this.props.status
  }

  get type(): ProductType {
    return this.props.type
  }

  get priceCents(): number {
    return this.props.priceCents
  }

  get currency(): Currency {
    return this.props.currency
  }

  get billingCycle(): string | undefined {
    return this.props.billingCycle
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  update(input: {
    readonly billingCycle?: string
    readonly currency?: string
    readonly description?: string
    readonly name?: string
    readonly now: Date
    readonly priceCents?: number
  }): void {
    if (this.props.status.isArchived()) {
      throw new ProductAlreadyArchivedError()
    }
    if (input.priceCents !== undefined) {
      assertPriceCents(input.priceCents)
    }
    this.props = {
      ...this.props,
      billingCycle: input.billingCycle ?? this.props.billingCycle,
      currency: input.currency === undefined ? this.props.currency : Currency.create(input.currency),
      description: input.description === undefined ? this.props.description : input.description.trim(),
      name: input.name === undefined ? this.props.name : NonEmptyString.create(input.name, "name"),
      priceCents: input.priceCents ?? this.props.priceCents,
      updatedAt: input.now,
    }
    this.events.push(createDomainEvent("catalog.product.updated", { productId: this.id.value }, input.now))
  }

  publish(now: Date): void {
    if (this.props.status.isArchived()) {
      throw new ProductNotPublishableError()
    }
    this.props = { ...this.props, status: ProductStatus.create("published"), updatedAt: now }
    this.events.push(createDomainEvent("catalog.product.published", { productId: this.id.value }, now))
  }

  archive(now: Date): void {
    if (this.props.status.isArchived()) {
      throw new ProductAlreadyArchivedError()
    }
    this.props = { ...this.props, status: ProductStatus.create("archived"), updatedAt: now }
    this.events.push(createDomainEvent("catalog.product.archived", { productId: this.id.value }, now))
  }

  pullEvents(): DomainEvent[] {
    const drained = this.events
    this.events = []
    return drained
  }
}
