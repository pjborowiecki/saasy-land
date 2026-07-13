"use client"

import type { JSX } from "react"

import { UserPlus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "~/src/components/shadcn/button"

export function UsersAllUsersAddUserButton(): JSX.Element {
  const t = useTranslations("pages.admin.users")

  return (
    <Button size="sm" className="h-10 gap-2 whitespace-nowrap">
      <UserPlus className="size-4" />
      {t("actions.addUser")}
    </Button>
  )
}
