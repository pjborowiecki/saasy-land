import "server-only"

import { Redis } from "@upstash/redis"

import { env } from "~/src/environment"

export const redis = new Redis({
  automaticDeserialization: false,
  token: env.KV_REST_API_TOKEN,
  url: env.KV_REST_API_URL,
})
