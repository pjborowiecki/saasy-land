import { Geist as geistFont, Geist_Mono as geistMonoFont } from "next/font/google"

/*
 * Two families, two jobs, no third.
 *
 *   --font-sans     Geist       everything: display, headings, titles, leads, body, controls
 *   --font-mono     Geist Mono  measured facts only: real numbers, specs, system output
 *
 * The display face is deliberately absent. A separate heading family buys a second voice
 * and charges a second download for it, and the whole point of the type ramp is that size,
 * weight and optical tracking carry the hierarchy on their own. `--font-heading` still
 * exists as a role in globals.css and currently resolves to Geist.
 *
 * Both carry `latin-ext`, which is not optional here: the pl-PL locale needs the Polish
 * diacritics (a-ogonek, e-ogonek, l-stroke, s/z/c-acute, z-dot) that live in that subset.
 * Without it those glyphs fall out of the family mid-word and the Polish page renders in a
 * system fallback everywhere an accent appears.
 */

export const geistSans = geistFont({
  display: "swap",
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-sans",
})

export const geistMono = geistMonoFont({
  display: "swap",
  // Mono is reserved for measured facts and none of them sit above the fold, so the
  // face is fetched with the rest of the page rather than competing with the LCP.
  preload: false,
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
})
