import type { JSX } from "react"

import { Laptop, Smartphone } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"

import type { DashboardSessionItem as DashboardSessionItemType } from "~/src/app/[locale]/(admin)/admin/_types"

interface DashboardSessionItemProps {
  readonly session: DashboardSessionItemType
}

export async function DashboardSessionItem({ session }: DashboardSessionItemProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.dashboard")
  return (
    <div className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-secondary/50">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground">
          {session.icon === "laptop" ? <Laptop className="size-5" /> : <Smartphone className="size-5" />}
        </div>
        <DashboardSessionItemDetails device={session.device} isCurrent={session.isCurrent} location={session.location} />
      </div>
      {!session.isCurrent && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs font-medium text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
        >
          {t("sessions.revoke")}
        </Button>
      )}
    </div>
  )
}

async function DashboardSessionItemDetails({
  device,
  isCurrent,
  location,
}: {
  readonly device: string
  readonly isCurrent: boolean | undefined
  readonly location: string
}): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.dashboard")
  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        {device}
        {isCurrent === true ? (
          <Badge variant="outline" className="border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            {t("sessions.current")}
          </Badge>
        ) : undefined}
      </p>
      <p className="text-xs text-muted-foreground">{location}</p>
    </div>
  )
}
