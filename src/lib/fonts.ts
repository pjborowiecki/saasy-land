import { Geist as geistFont, Geist_Mono as geistMonoFont } from "next/font/google"

export const geistSans = geistFont({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const geistMono = geistMonoFont({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})
