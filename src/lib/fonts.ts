import { Geist as geistFont, Geist_Mono as geistMonoFont } from "next/font/google"

export const geistSans = geistFont({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const geistMono = geistMonoFont({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  variable: "--font-geist-mono",
})
