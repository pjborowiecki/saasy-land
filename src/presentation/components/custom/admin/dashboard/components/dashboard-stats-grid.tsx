import type { JSX } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTranslations } from "use-intl/react"

import { getProductsQuery } from "~/src/modules/product/use-cases/get-products"
import { getUsersQuery } from "~/src/modules/user/use-cases/get-users"

/**
 * One plate, three readings, hairlines between them.
 *
 * Three separate cards, each with its own border, its own icon in its own bordered tile and its
 * own gradient wash that faded on hover, made three objects out of one instrument panel. The
 * icons in particular were doing nothing: a person, a box and a warning triangle repeated the
 * label directly underneath them in a less precise form.
 *
 * The figures are `tabular-nums`, so the columns stay in place while the numbers change, and the
 * labels are set in the monospace micro-label, the same role the marketing site's measured facts
 * use. A number and its unit look the same in both places, which is the point.
 */
export const DashboardStatsGrid = (): JSX.Element => {
  const userRows = useSuspenseQuery(getUsersQuery).data
  const products = useSuspenseQuery(getProductsQuery).data
  const t = useTranslations("pages.admin.dashboard")

  const pendingVerificationCount = userRows.filter((row) => !row.emailVerified && !row.banned).length

  const stats = [
    { key: "activeUsers", value: userRows.length },
    { key: "totalProducts", value: products.length },
    { key: "pendingVerification", value: pendingVerificationCount },
  ] as const

  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border ring-1 ring-foreground/10 sm:grid-cols-3">
      {stats.map((stat) => (
        <div className="bg-card px-5 py-5" key={stat.key}>
          <dt className="font-mono text-label text-muted-foreground uppercase">{t(`stats.${stat.key}.title`)}</dt>
          <dd className="mt-3 text-headline-support text-foreground tabular-nums">{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}
