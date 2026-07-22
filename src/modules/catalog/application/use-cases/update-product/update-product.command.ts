export interface UpdateProductCommand {
  readonly billingCycle?: string
  readonly currency?: string
  readonly description?: string
  readonly name?: string
  readonly priceCents?: number
  readonly productId: string
}
