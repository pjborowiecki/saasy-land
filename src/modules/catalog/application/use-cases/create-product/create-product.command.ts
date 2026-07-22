export interface CreateProductCommand {
  readonly billingCycle?: string
  readonly currency?: string
  readonly description: string
  readonly name: string
  readonly priceCents: number
  readonly type: string
}
