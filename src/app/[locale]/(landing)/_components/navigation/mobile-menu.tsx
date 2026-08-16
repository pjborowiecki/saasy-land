"use client"

import { type JSX, useCallback, useEffect, useState } from "react"

import { ArrowUpRight, Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/presentation/components/shadcn/button"

import { NAV_SECTIONS } from "~/src/app/[locale]/(landing)/_components/navigation/_lib/nav-sections"
import { ROUTES } from "~/src/routes"

const MENU_ID = "landing-mobile-menu"

/**
 * Drawer rows speak at title scale. On a phone this list is the whole navigation, and 14px
 * links in a full-bleed panel read as a placeholder for one.
 */
const ROW_CLASSNAME =
  "group flex items-center justify-between gap-6 py-4 text-[1.0625rem] font-medium tracking-tight text-foreground transition-colors duration-200 ease-exp hover:text-muted-foreground"

/**
 * Small-screen nav drawer.
 *
 * Rows are real `<a href="#…">`, so the browser owns the navigation: `scroll-behavior: smooth`
 * and `scroll-margin-top` in the base layer already put the section in the right place, and the
 * link works before hydration and on a middle-click. The only thing this component adds is
 * closing itself afterwards.
 */
export function MobileMenu(): JSX.Element {
  const t = useTranslations("components.navigation")
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback((): void => {
    setIsOpen((open) => !open)
  }, [])

  const close = useCallback((): void => {
    setIsOpen(false)
  }, [])

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
      {/* size-11: the icon stays 16px, the hit area goes to 44px. This is the only way into
          the navigation on a phone. */}
      <Button
        aria-controls={MENU_ID}
        aria-expanded={isOpen}
        aria-label={t(isOpen ? "closeMenu" : "openMenu")}
        className="size-11"
        onPress={toggle}
        size="icon-lg"
        variant="ghost"
      >
        {isOpen ? <X aria-hidden className="size-4.5" strokeWidth={1.5} /> : <Menu aria-hidden className="size-4.5" strokeWidth={1.5} />}
      </Button>
      {isOpen && (
        // Positioned against the header, not the viewport: the header carries `backdrop-blur`,
        // and a backdrop-filter makes an element the containing block for its fixed-position
        // descendants, so a `fixed inset-x-0 top-16 bottom-0` drawer would resolve against the
        // 4rem bar and collapse to nothing. `top-full` plus an explicit height is the honest form.
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
              <Link className={ROW_CLASSNAME} href={ROUTES.DOCS}>
                {t("items.docs")}
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-exp group-hover:translate-x-px group-hover:-translate-y-px"
                  strokeWidth={1.5}
                />
              </Link>
            </li>
            {/* A phone has no room for a second bar action, so the drawer is the only place a
                returning customer can reach their account. */}
            <li>
              <Link className={ROW_CLASSNAME} href={ROUTES.SIGN_IN} onClick={close}>
                {t("signIn")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
