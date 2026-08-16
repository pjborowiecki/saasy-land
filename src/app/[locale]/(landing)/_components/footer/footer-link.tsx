import type { JSX } from "react"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { type FooterLinkHref } from "~/src/app/[locale]/(landing)/_components/footer/_lib/footer-links"

const FOOTER_LINK_CLASSNAME =
  "inline-block rounded-sm py-1.5 text-body-sm text-muted-foreground transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const ANCHOR_PREFIX = "/#"

export function FooterLink({ href, label }: Readonly<{ href: FooterLinkHref; label: string }>): JSX.Element {
  if (href.startsWith(ANCHOR_PREFIX)) {
    return (
      <a className={FOOTER_LINK_CLASSNAME} href={href}>
        {label}
      </a>
    )
  }

  return (
    <Link className={FOOTER_LINK_CLASSNAME} href={href}>
      {label}
    </Link>
  )
}
