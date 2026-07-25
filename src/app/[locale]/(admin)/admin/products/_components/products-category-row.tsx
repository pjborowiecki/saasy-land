import type { JSX } from "react"

import { Eye, EyeOff } from "lucide-react"

import type { CategoryVisibility } from "~/src/modules/category/category.schema"
import type { Category } from "~/src/modules/category/category.types"

import { Badge } from "~/src/presentation/components/shadcn/badge"

import { getVisibilityBadgeClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import { AdminTableCheckbox } from "~/src/app/[locale]/(admin)/admin/products/_components/admin-table-checkbox"
import { ProductsRowActionsButton } from "~/src/app/[locale]/(admin)/admin/products/_components/products-row-actions-button"

const VISIBILITY_LABEL: Record<CategoryVisibility, string> = {
  hidden: "Hidden",
  public: "Public",
}

const ITEMS_PLACEHOLDER = "0"

interface ProductsCategoryRowProps {
  readonly category: Category["select"]
}

function VisibilityIcon({ isPublic }: { readonly isPublic: boolean }): JSX.Element {
  return isPublic ? <Eye className="mr-1.5 size-3" /> : <EyeOff className="mr-1.5 size-3" />
}

function formatLastUpdated(updatedAt: Date): string {
  return updatedAt.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function ProductsCategoryRow({ category }: ProductsCategoryRowProps): JSX.Element {
  const isPublic = category.visibility === "public"

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
        <Badge variant="outline" className={`px-2 py-1 text-[10px] font-medium ${getVisibilityBadgeClass(category.visibility)}`}>
          <VisibilityIcon isPublic={isPublic} />
          {VISIBILITY_LABEL[category.visibility]}
        </Badge>
      </td>
      <td className="p-4 pt-5 align-top">
        <div className="text-sm font-medium text-foreground">
          {ITEMS_PLACEHOLDER} <span className="font-normal text-muted-foreground">products</span>
        </div>
      </td>
      <td className="p-4 pt-5 align-top text-sm text-muted-foreground">{formatLastUpdated(category.updatedAt)}</td>
      <td className="p-4 pt-4 text-right align-top">
        <ProductsRowActionsButton />
      </td>
    </tr>
  )
}
