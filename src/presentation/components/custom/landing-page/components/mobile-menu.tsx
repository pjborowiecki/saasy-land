import { type JSX, useEffect, useState } from "react"

import { Link } from "@tanstack/react-router"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { NAV_SECTIONS } from "~/src/data/marketing-navigation"

import { Button } from "~/src/presentation/components/shadcn/button"

import { ROUTES } from "~/src/routes"

const MENU_ID = "landing-mobile-menu"

const ROW_CLASSNAME =
  "group flex items-center justify-between gap-6 py-4 text-[1.0625rem] font-medium tracking-tight text-foreground transition-colors duration-200 ease-exp hover:text-muted-foreground"

export const MobileMenu = (): JSX.Element => {
  const t = useTranslations("components.navigation")
  const [isOpen, setIsOpen] = useState(false)

  const close = (): void => {
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      <Button
        aria-controls={MENU_ID}
        aria-expanded={isOpen}
        aria-label={t(isOpen ? "closeMenu" : "openMenu")}
        className="size-11"
        onPress={() => {
          setIsOpen((open) => !open)
        }}
        size="icon-lg"
        variant="ghost"
      >
        {isOpen ? <X aria-hidden className="size-4.5" strokeWidth={1.5} /> : <Menu aria-hidden className="size-4.5" strokeWidth={1.5} />}
      </Button>
      {isOpen && (
        // The backdrop-filtered header is the positioning container.
        <div
          className="absolute inset-x-0 top-full h-[calc(100svh-4rem)] overflow-y-auto overscroll-contain border-t border-border bg-background transition-[opacity,transform] duration-300 ease-exp motion-reduce:transition-none starting:-translate-y-2 starting:opacity-0"
          id={MENU_ID}
        >
          <ul className="mx-auto w-full max-w-7xl divide-y divide-border px-6 pb-10">
            {NAV_SECTIONS.map((item) => (
              <li key={item}>
                <a className={ROW_CLASSNAME} href={`#${item}`} onClick={close}>
                  {t(`items.${item}`)}
                </a>
              </li>
            ))}
            <li>
              <Link className={ROW_CLASSNAME} to={ROUTES.DOCS}>
                {t("items.docs")}
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-exp group-hover:translate-x-px group-hover:-translate-y-px"
                  strokeWidth={1.5}
                />
              </Link>
            </li>

            <li>
              <Link className={ROW_CLASSNAME} to={ROUTES.SIGN_IN} onClick={close}>
                {t("signIn")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
