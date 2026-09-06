import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { Card } from "~/src/presentation/components/shadcn/card"
import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { ProductsTabToolbar } from "~/src/presentation/components/custom/admin/products/components/products-tab-toolbar"

export const ProductsCoursesTab = (): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  return (
    <TabsContent id="courses" className="mt-6 space-y-4 outline-none">
      <ProductsTabToolbar />

      <Card className="overflow-hidden">
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">{tCommon("labels.noCourses")}</div>
      </Card>
    </TabsContent>
  )
}
