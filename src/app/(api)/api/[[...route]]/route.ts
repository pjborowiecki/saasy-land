import { Elysia } from "elysia"

const app = new Elysia({ prefix: "/api" })

app.get("/", "Hello from Saasy Land 2.0!")

export type App = typeof app

export const GET = app.fetch
export const POST = app.fetch
