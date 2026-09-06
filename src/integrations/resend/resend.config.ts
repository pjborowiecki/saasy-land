import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

import { Resend } from "resend"

export const resend = new Resend(env.RESEND_API_KEY)
