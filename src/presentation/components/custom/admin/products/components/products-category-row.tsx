import type { JSX } from "react"

import { Eye, EyeOff } from "lucide-react"
import { useTranslations } from "use-intl/react"

import type { Category } from "~/src/modules/category/category.types"

import { useDateFormatter } from "~/src/hooks/use-date-formatter"

import { Badge } from "~/src/presentation/components/shadcn/badge"

import { getVisibilityBadgeClass } from "~/src/presentation/components/custom/admin/constants/status-colors"
import { AdminTableCheckbox } from "~/src/presentation/components/custom/admin/products/components/admin-table-checkbox"
import { ProductsRowActionsButton } from "~/src/presentation/components/custom/admin/products/components/products-row-actions-button"

const ITEMS_PLACEHOLDER = "0"

interface ProductsCategoryRowProps {
  readonly category: Category["select"]
}

const VisibilityIcon = ({ isPublic }: { readonly isPublic: boolean }): JSX.Element =>
  isPublic ? <Eye className="mr-1.5 size-3" /> : <EyeOff className="mr-1.5 size-3" />

export const ProductsCategoryRow = ({ category }: ProductsCategoryRowProps): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  const { formatDate } = useDateFormatter({ day: "numeric", month: "short", year: "numeric" })
  const isPublic = category.visibility === "public"

  return (
    <tr className="group transition-colors hover:bg-muted/40">
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
          {tCommon(`labels.${category.visibility}`)}
        </Badge>
      </td>
      <td className="p-4 pt-5 align-top">
        <div className="text-sm font-medium text-foreground">
          {ITEMS_PLACEHOLDER} <span className="font-normal text-muted-foreground">{tCommon("labels.products")}</span>
        </div>
      </td>
      <td className="p-4 pt-5 align-top text-sm text-muted-foreground">{formatDate({ value: category.updatedAt })}</td>
      <td className="p-4 pt-4 text-right align-top">
        <ProductsRowActionsButton />
      </td>
    </tr>
  )
}
