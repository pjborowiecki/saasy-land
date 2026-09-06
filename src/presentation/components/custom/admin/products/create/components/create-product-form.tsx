import type { JSX } from "react"

import { CreateProductGeneralSection } from "~/src/presentation/components/custom/admin/products/create/components/create-product-general-section"
import { CreateProductMediaSection } from "~/src/presentation/components/custom/admin/products/create/components/create-product-media-section"
import { CreateProductOrganizationSection } from "~/src/presentation/components/custom/admin/products/create/components/create-product-organization-section"
import { CreateProductPricingSection } from "~/src/presentation/components/custom/admin/products/create/components/create-product-pricing-section"
import { CreateProductStatusSection } from "~/src/presentation/components/custom/admin/products/create/components/create-product-status-section"

export const CreateProductForm = (): JSX.Element => (
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
