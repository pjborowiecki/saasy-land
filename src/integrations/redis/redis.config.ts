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

export type RedisClientConstructor = new (config: { automaticDeserialization: boolean; token: string; url: string }) => AppRedis

export function createAppRedis(client: AppRedis): AppRedis {
  return {
    del: (key) => client.del(key),
    expire: (key, seconds) => client.expire(key, seconds),
    get: (key) => client.get(key),
    getdel: (key) => client.getdel(key),
    incr: (key) => client.incr(key),
    set: (key, value, opts) => client.set(key, value, opts),
  }
}

export function createAppRedisFromConstructor(RedisCtor: RedisClientConstructor, config: { token: string; url: string }): AppRedis {
  const client = new RedisCtor({
    automaticDeserialization: false,
    token: config.token,
    url: config.url,
  })
  return createAppRedis(client)
}

export const redis: AppRedis = createAppRedisFromConstructor(Redis, {
  token: env.KV_REST_API_TOKEN,
  url: env.KV_REST_API_URL,
})
