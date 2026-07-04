import "server-only"

import { Resend } from "resend"

import { env } from "~/src/environment"

export const resend = new Resend(env.RESEND_API_KEY)
