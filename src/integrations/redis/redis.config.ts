import "server-only"

import { Redis } from "@upstash/redis"

import { env } from "~/src/platform/env"

export interface AppRedis {
  del: (key: string) => Promise<number>
  expire: (key: string, seconds: number) => Promise<number>
  get: (key: string) => Promise<string | null>
  getdel: (key: string) => Promise<string | null>
  incr: (key: string) => Promise<number>
  set: (key: string, value: string, opts?: { ex: number }) => Promise<string | null>
}

export const redis: AppRedis = new Redis({
  automaticDeserialization: false,
  token: env.KV_REST_API_TOKEN,
  url: env.KV_REST_API_URL,
})
