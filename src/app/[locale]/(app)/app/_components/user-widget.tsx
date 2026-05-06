import type { JSX, ReactNode } from "react"

import { getTranslations } from "next-intl/server"

import { getCurrentSession } from "~/src/integrations/better-auth/auth.utils"

import { SignOutButton } from "~/src/app/[locale]/(app)/app/_components/sign-out-button"

const renderUserSpan = (chunks: ReactNode) => <span className="font-medium text-foreground">{chunks}</span>

export async function UserWidget(): Promise<JSX.Element | null> {
  const session = await getCurrentSession()
  if (!session) return null

  const t = await getTranslations("app.components.userWidget")

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">
        {t.rich("signedInAs", {
          name: session.user.name ?? session.user.email,
          user: renderUserSpan,
        })}
      </p>
      <div>
        <SignOutButton />
      </div>
    </div>
  )
}
