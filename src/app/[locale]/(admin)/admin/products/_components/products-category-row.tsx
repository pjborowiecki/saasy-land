import type { JSX } from "react"

import { Eye, EyeOff } from "lucide-react"

import { Badge } from "~/src/components/shadcn/badge"

import { AdminTableCheckbox } from "~/src/app/[locale]/(admin)/admin/_components/admin-table-checkbox"
import { getVisibilityBadgeClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import type { AdminCategoryRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { ProductsRowActionsButton } from "~/src/app/[locale]/(admin)/admin/products/_components/products-row-actions-button"

interface ProductsCategoryRowProps {
  readonly category: AdminCategoryRow
}

function VisibilityIcon({ isPublic }: { readonly isPublic: boolean }): JSX.Element {
  return isPublic ? <Eye className="mr-1.5 size-3" /> : <EyeOff className="mr-1.5 size-3" />
}

export function ProductsCategoryRow({ category }: ProductsCategoryRowProps): JSX.Element {
  const isPublic = category.visibilityStatus === "public"

  return (
    <tr className="group transition-colors hover:bg-secondary/20">
      <td className="p-4 pt-5 align-top">
        <AdminTableCheckbox />
      </td>
      <td className="p-4 align-top">
        <div className="text-sm font-medium text-foreground">{category.name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{category.description}</div>
      </td>
      <td className="p-4 pt-5 align-top">
        <Badge variant="outline" className={`px-2 py-1 text-[10px] font-medium ${getVisibilityBadgeClass(category.visibilityStatus)}`}>
          <VisibilityIcon isPublic={isPublic} />
          {category.visibility}
        </Badge>
      </td>
      <td className="p-4 pt-5 align-top">
        <div className="text-sm font-medium text-foreground">
          {category.items} <span className="font-normal text-muted-foreground">products</span>
        </div>
      </td>
      <td className="p-4 pt-5 align-top text-sm text-muted-foreground">{category.lastUpdated}</td>
      <td className="p-4 pt-4 text-right align-top">
        <ProductsRowActionsButton />
      </td>
    </tr>
  )
}
