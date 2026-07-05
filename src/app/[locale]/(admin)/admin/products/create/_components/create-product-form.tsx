import type { JSX } from "react"

import { CreateProductGeneralSection } from "~/src/app/[locale]/(admin)/admin/products/create/_components/create-product-general-section"
import { CreateProductMediaSection } from "~/src/app/[locale]/(admin)/admin/products/create/_components/create-product-media-section"
import { CreateProductOrganizationSection } from "~/src/app/[locale]/(admin)/admin/products/create/_components/create-product-organization-section"
import { CreateProductPricingSection } from "~/src/app/[locale]/(admin)/admin/products/create/_components/create-product-pricing-section"
import { CreateProductStatusSection } from "~/src/app/[locale]/(admin)/admin/products/create/_components/create-product-status-section"

export function CreateProductForm(): JSX.Element {
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="space-y-6 lg:col-span-2">
        <CreateProductGeneralSection />
        <CreateProductPricingSection />
        <CreateProductMediaSection />
      </div>

      <div className="space-y-6 lg:col-span-1">
        <CreateProductStatusSection />
        <CreateProductOrganizationSection />
      </div>
    </div>
  )
}
