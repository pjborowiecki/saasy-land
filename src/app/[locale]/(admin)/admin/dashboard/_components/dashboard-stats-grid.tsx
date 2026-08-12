import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { getProducts } from "~/src/modules/product/use-cases/get-products.use-case"
import { getUsers } from "~/src/modules/user/use-cases/get-users.use-case"

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
export async function DashboardStatsGrid(): Promise<JSX.Element> {
  const [userRows, products, t] = await Promise.all([getUsers(), getProducts(), getTranslations("pages.admin.dashboard")])

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
