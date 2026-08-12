import { loadFont as loadGeist } from "@remotion/google-fonts/Geist"
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono"

/**
 * The page's two families, loaded once at module scope so every composition waits on the same
 * promise and no frame renders in a fallback face. Same families as `src/presentation/fonts`,
 * because a band whose numerals are not Geist Mono is visibly not part of the page it sits in.
 *
 * Only the weights and subsets these compositions actually set. Left unrestricted, `loadFont()`
 * fetches every weight of every subset, which was 108 network requests per render for four weights
 * of Latin text.
 */
const geist = loadGeist("normal", { subsets: ["latin"], weights: ["400", "500", "600"] })
const geistMono = loadGeistMono("normal", { subsets: ["latin"], weights: ["400"] })

export const SANS = geist.fontFamily
export const MONO = geistMono.fontFamily
