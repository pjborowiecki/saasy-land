import { type JSX, useEffect, useState } from "react"

import { Link } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { NAV_SECTIONS } from "~/src/data/marketing-navigation"

import { cn } from "~/src/lib/cn"

import { ROUTES } from "~/src/routes"

const ROUTE_ITEMS = [
  { href: ROUTES.BLOG, key: "blog" },
  { href: ROUTES.DOCS, key: "docs" },
] as const

const LINK_CLASSNAME =
  "relative rounded-md px-2 py-1.5 text-body-sm transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const ACTIVE_BAND = "-42% 0px -58% 0px"

export const NavLinks = (): JSX.Element => {
  const [active, setActive] = useState<string>()

  const t = useTranslations("components.navigation")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: ACTIVE_BAND },
    )

    for (const item of NAV_SECTIONS) {
      const section = document.querySelector(`#${item}`)
      if (section) {
        observer.observe(section)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {NAV_SECTIONS.map((item) => (
        <a className={cn(LINK_CLASSNAME, active === item ? "text-foreground" : "text-muted-foreground")} href={`#${item}`} key={item}>
          {t(`items.${item}`)}
          {active === item && <span aria-hidden className="absolute inset-x-0 -bottom-0.5 mx-auto size-0.75 rounded-full bg-ring" />}
        </a>
      ))}
      {ROUTE_ITEMS.map((item) => (
        <Link className={cn(LINK_CLASSNAME, "text-muted-foreground")} to={item.href} key={item.key}>
          {t(`items.${item.key}`)}
        </Link>
      ))}
    </nav>
  )
}
