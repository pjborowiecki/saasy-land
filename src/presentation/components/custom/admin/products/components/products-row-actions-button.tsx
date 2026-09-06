import type { JSX } from "react"

import { MoreHorizontal } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"

export const ProductsRowActionsButton = (): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-secondary hover:text-foreground focus:opacity-100"
      aria-label={tCommon("labels.rowActions")}
    >
      <MoreHorizontal className="size-4" />
    </Button>
  )
}
