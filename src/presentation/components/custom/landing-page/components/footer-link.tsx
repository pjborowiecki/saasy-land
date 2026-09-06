import type { JSX } from "react"

import { Link } from "@tanstack/react-router"

import { type FooterLinkHref } from "~/src/data/marketing-footer"

const FOOTER_LINK_CLASSNAME =
  "inline-block rounded-sm py-1.5 text-body-sm text-muted-foreground transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export const FooterLink = ({ href, label }: Readonly<{ href: FooterLinkHref; label: string }>): JSX.Element => {
  if (href === "/#faq" || href === "/#foundation" || href === "/#pricing") {
    return (
      <Link className={FOOTER_LINK_CLASSNAME} to="/" hash={href.slice("/#".length)}>
        {label}
      </Link>
    )
  }

  return (
    <Link className={FOOTER_LINK_CLASSNAME} to={href}>
      {label}
    </Link>
  )
}
