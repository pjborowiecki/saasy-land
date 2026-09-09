import { loadFont as loadGeist } from "@remotion/google-fonts/Geist"
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono"

// Load only the Latin weights used in the compositions.
const geist = loadGeist("normal", { subsets: ["latin"], weights: ["400", "500", "600"] })
const geistMono = loadGeistMono("normal", { subsets: ["latin"], weights: ["400"] })

export const SANS = geist.fontFamily
export const MONO = geistMono.fontFamily
