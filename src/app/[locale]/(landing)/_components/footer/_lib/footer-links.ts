import { ROUTES } from "~/src/routes"

export const PRODUCT_LINKS = [
  { href: `${ROUTES.HOME}${ROUTES.HOME_FOUNDATION_SECTION}`, labelKey: "links.foundation" },
  { href: `${ROUTES.HOME}${ROUTES.HOME_PRICING_SECTION}`, labelKey: "links.pricing" },
  { href: `${ROUTES.HOME}${ROUTES.HOME_FAQ_SECTION}`, labelKey: "links.faq" },
  { href: ROUTES.DOCS, labelKey: "links.docs" },
  { href: ROUTES.BLOG, labelKey: "links.blog" },
  { href: ROUTES.SIGN_IN, labelKey: "links.signIn" },
] as const

export const LEGAL_LINKS = [
  { href: ROUTES.PRIVACY, labelKey: "links.privacy" },
  { href: ROUTES.TERMS, labelKey: "links.terms" },
] as const

export type FooterLinkHref = (typeof LEGAL_LINKS | typeof PRODUCT_LINKS)[number]["href"]
