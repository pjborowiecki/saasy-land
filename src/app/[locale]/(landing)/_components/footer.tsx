"use client"

import type { JSX } from "react"
import { useEffect, useState } from "react"

import { Rocket } from "lucide-react"
import { useTranslations } from "next-intl"

import { CONSTANTS } from "~/src/constants"

export function Footer(): JSX.Element {
  const t = useTranslations("landingPage.footer")
  const [year, setYear] = useState(2026)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="relative z-10 bg-background pt-20 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <Rocket className="size-5 text-foreground" />
            <span className="font-medium text-foreground text-sm">{CONSTANTS.APP_NAME}</span>
            <span className="ml-2 text-muted-foreground text-xs">{t("copyright", { year })}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
