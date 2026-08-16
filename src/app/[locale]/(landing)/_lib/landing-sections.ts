export const LANDING_SECTIONS = {
  CLI: "cli",
  FAQ: "faq",
  FLOOR: "floor",
  FOUNDATION: "foundation",
  GATE: "gate",
  MANIFESTO: "manifesto",
  PRICING: "pricing",
  QUALITY: "quality",
  TOOLKIT: "toolkit",
} as const

export type LandingSection = (typeof LANDING_SECTIONS)[keyof typeof LANDING_SECTIONS]

export const NAV_SECTIONS = [
  LANDING_SECTIONS.FOUNDATION,
  LANDING_SECTIONS.QUALITY,
  LANDING_SECTIONS.TOOLKIT,
  LANDING_SECTIONS.PRICING,
  LANDING_SECTIONS.FAQ,
] as const

export function sectionHref(section: LandingSection): string {
  return `/#${section}`
}
