import "@tanstack/react-start/server-only"

import { licenseTierForProduct } from "~/src/modules/license/license.utils"
import { attachLicenseKey } from "~/src/modules/license/use-cases/attach-license-key"
import { grantLicense } from "~/src/modules/license/use-cases/grant-license"
import { revokeLicense } from "~/src/modules/license/use-cases/revoke-license"

interface PolarCustomer {
  readonly externalId?: string | null | undefined
}

interface OrderEvent {
  readonly data: {
    readonly customer: PolarCustomer
    readonly customerId: string
    readonly id: string
    readonly productId: string | null
  }
}

interface BenefitGrantEvent {
  readonly data: {
    readonly customer: PolarCustomer
    readonly id: string
    readonly properties: Readonly<Record<string, unknown>>
  }
}

export const licenseWebhookHandlers = {
  onBenefitGrantCreated: async ({ data }: BenefitGrantEvent): Promise<void> => {
    const { externalId } = data.customer
    const { licenseKeyId } = data.properties

    if (typeof licenseKeyId !== "string") {
      return
    }

    if (typeof externalId !== "string" || externalId.length === 0) {
      console.error(`[license] benefit grant ${data.id} has no external customer`)
      return
    }

    await attachLicenseKey({ polarLicenseKeyId: licenseKeyId, userId: externalId })
  },

  onBenefitGrantRevoked: async ({ data }: BenefitGrantEvent): Promise<void> => {
    const { externalId } = data.customer

    if (typeof externalId === "string" && externalId.length > 0) {
      await revokeLicense(externalId)
    }
  },

  onOrderPaid: async ({ data }: OrderEvent): Promise<void> => {
    const { externalId } = data.customer
    const tier = data.productId === null ? undefined : licenseTierForProduct(data.productId)

    if (typeof externalId !== "string" || externalId.length === 0 || tier === undefined) {
      console.error(`[license] order ${data.id} does not map to a known user and tier`)
      return
    }

    await grantLicense({ polarCustomerId: data.customerId, polarOrderId: data.id, tier, userId: externalId })
  },

  onOrderRefunded: async ({ data }: OrderEvent): Promise<void> => {
    const { externalId } = data.customer

    if (typeof externalId === "string" && externalId.length > 0) {
      await revokeLicense(externalId)
    }
  },
}
