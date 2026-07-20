import type { JSX } from "react"

import { Card } from "~/src/components/shadcn/card"
import { TabsContent } from "~/src/components/shadcn/tabs"

import { ProductsTabToolbar } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tab-toolbar"

export function ProductsCoursesTab(): JSX.Element {
  return (
    <TabsContent id="courses" className="mt-6 space-y-4 outline-none">
      <ProductsTabToolbar />

      <Card className="overflow-hidden">
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">No courses found.</div>
      </Card>
    </TabsContent>
  )
}
