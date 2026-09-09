import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

import { Polar } from "@polar-sh/sdk"

export const POLAR_PRODUCT_IDS = {
  agency: env.POLAR_PRODUCT_ID_AGENCY,
  complete: env.POLAR_PRODUCT_ID_COMPLETE,
  core: env.POLAR_PRODUCT_ID_CORE,
} as const

export const polar = new Polar({ accessToken: env.POLAR_ACCESS_TOKEN, server: env.POLAR_SERVER })
