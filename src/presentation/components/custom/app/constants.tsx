import type { ReactNode } from "react"

import { Link } from "@tanstack/react-router"

import { ROUTES } from "~/src/routes"

const LEGAL_LINK_CLASSNAME = "underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"

export const LEGAL_TAGS = {
  licence: (children: ReactNode) => (
    <Link className={LEGAL_LINK_CLASSNAME} to={ROUTES.LICENCE}>
      {children}
    </Link>
  ),
  refunds: (children: ReactNode) => (
    <Link className={LEGAL_LINK_CLASSNAME} to={ROUTES.REFUNDS}>
      {children}
    </Link>
  ),
  terms: (children: ReactNode) => (
    <Link className={LEGAL_LINK_CLASSNAME} to={ROUTES.TERMS}>
      {children}
    </Link>
  ),
}
