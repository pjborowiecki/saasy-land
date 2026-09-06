import type { JSX } from "react"

import { Link } from "@tanstack/react-router"
import { ChevronDown, Filter, PlusCircle, Search } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Input } from "~/src/presentation/components/shadcn/input"

interface ProductsTabToolbarProps {
  readonly showStatusFilter?: boolean
  readonly showTypeFilter?: boolean
}

export const ProductsTabToolbar = ({ showStatusFilter = true, showTypeFilter = true }: ProductsTabToolbarProps): JSX.Element => {
  const t = useTranslations("pages.admin.products")
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex items-center gap-3">
        {showTypeFilter ? (
          <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
            <Filter className="size-4 text-muted-foreground" />
            {t("filters.type")}
            <ChevronDown className="ml-1 size-4 text-muted-foreground" />
          </Button>
        ) : undefined}
        {showStatusFilter ? (
          <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
            {t("filters.status")}
            <ChevronDown className="ml-1 size-4 text-muted-foreground" />
          </Button>
        ) : undefined}
      </div>

      <div className="group relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <Input aria-label={t("search.placeholder")} placeholder={t("search.placeholder")} className="h-10 w-full pl-10" />
      </div>

      <Link to="/admin/products/create" className="shrink-0">
        <Button size="sm" className="h-10 w-full gap-2 sm:w-auto">
          <PlusCircle className="size-4" />
          {t("actions.create")}
        </Button>
      </Link>
    </div>
  )
}
