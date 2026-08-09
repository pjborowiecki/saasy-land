import type { Metadata } from "next"
import { type JSX } from "react"

import { getTranslations } from "next-intl/server"

import { getUsers } from "~/src/modules/user/use-cases/get-users.use-case"

import { SectionErrorBoundary } from "~/src/presentation/components/custom/section-error-boundary"

import { AddUserButton } from "~/src/app/[locale]/(admin)/admin/users/all/_components/actions"
import { AllUsersTable } from "~/src/app/[locale]/(admin)/admin/users/all/_components/all-users-table"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.admin.users")
  return { description: t("metadata.description"), title: `${t("tabs.allUsers")} | ${t("metadata.title")}` }
}

export default function AllUsersPage(): JSX.Element {
  const usersPromise = getUsers()

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
      <div className="flex justify-end">
        <AddUserButton />
      </div>

      <SectionErrorBoundary>
        <AllUsersTable usersPromise={usersPromise} />
      </SectionErrorBoundary>
    </div>
  )
}
