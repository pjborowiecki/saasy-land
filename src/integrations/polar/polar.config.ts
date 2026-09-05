import "server-only"

import { Polar } from "@polar-sh/sdk"

import { env } from "~/src/platform/env"

export const polar = new Polar({ accessToken: env.POLAR_ACCESS_TOKEN, server: env.POLAR_SERVER })
