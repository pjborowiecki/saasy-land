#!/usr/bin/env bun

import { $ } from "bun"

import { existsSync } from "node:fs"

const DRIZZLE_CONFIG = "./src/integrations/drizzle-orm/drizzle.config.ts"

const STRATEGIES = {
  remote: () => $`bun run db:migrate`,
  local: () => $`bun --env-file=.env.local run drizzle-kit migrate --config=${DRIZZLE_CONFIG}`,
  skip: () => console.info("[postinstall] skipping migration (no .env.local found)"),
} as const

function getMigrationStrategy(): keyof typeof STRATEGIES {
  const env = process.env.VERCEL_ENV

  if (env === "production" || env === "preview") {
    return "remote"
  }

  if (existsSync(".env.local")) {
    return "local"
  }

  return "skip"
}

await $`bun run --bun next typegen`

const strategyKey = getMigrationStrategy()
await STRATEGIES[strategyKey]()
