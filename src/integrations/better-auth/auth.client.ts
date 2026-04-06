"use client"

import { nextCookies } from "better-auth/next-js"
import { createAuthClient } from "better-auth/react"

import { env } from "~/src/environment"

const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [nextCookies()],
})

export const { signIn, signUp, signOut, useSession } = authClient
