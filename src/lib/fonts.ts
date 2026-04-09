import { Geist, Geist_Mono, Noto_Sans } from "next/font/google"

export const notoSans = Noto_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
})

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
