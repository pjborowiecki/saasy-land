import type { JSX, ReactNode } from "react"

import { Card } from "~/src/presentation/components/shadcn/card"

import { ProductsPagination } from "~/src/app/[locale]/(admin)/admin/products/_components/products-pagination"

interface ProductsTableCardProps {
  readonly children: ReactNode
  readonly end: number
  readonly total: number
}

export function ProductsTableCard({ children, end, total }: ProductsTableCardProps): JSX.Element {
  return (
    <Card className="overflow-hidden">
      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full border-collapse text-left">{children}</table>
      </div>

      <ProductsPagination end={end} total={total} />
    </Card>
  )
}
