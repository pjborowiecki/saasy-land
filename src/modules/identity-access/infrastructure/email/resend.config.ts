import "server-only"

import { Resend, type CreateEmailOptions } from "resend"

import { env } from "~/src/platform/env"

export interface AppResendResult {
  readonly data?: { readonly id?: string }
  readonly error?: { readonly message: string }
}

/** App-facing Resend surface — narrow so tests can supply a typed double. */
export interface AppResend {
  readonly emails: {
    readonly send: (options: CreateEmailOptions) => Promise<AppResendResult>
  }
}

interface ResendSdkClient {
  readonly emails: {
    readonly send: (options: CreateEmailOptions) => Promise<{
      readonly data?: unknown
      readonly error?: { readonly message: string }
    }>
  }
}

function readOptionalEmailId(data: object): { readonly id?: string } {
  if (!("id" in data)) {
    return {}
  }

  const { id } = data
  if (typeof id !== "string") {
    return {}
  }

  return { id }
}

/** Normalizes Resend SDK payloads (including nullish data) into a null-free app shape. */
export function toAppResendResult(response: { readonly data?: unknown; readonly error?: { readonly message: string } }): AppResendResult {
  if (response.error) {
    return { error: { message: response.error.message } }
  }

  const { data } = response
  if (data === undefined || typeof data !== "object" || !(data instanceof Object)) {
    return {}
  }

  return { data: readOptionalEmailId(data) }
}

export function createAppResend(client: ResendSdkClient): AppResend {
  return {
    emails: {
      send: async (options) => toAppResendResult(await client.emails.send(options)),
    },
  }
}

const client = new Resend(env.RESEND_API_KEY)

async function sendThroughSdk(options: CreateEmailOptions): Promise<{
  readonly data?: unknown
  readonly error?: { readonly message: string }
}> {
  const response = await client.emails.send(options)
  if (response.error) {
    return { error: { message: response.error.message } }
  }
  const data = response.data ?? undefined
  if (data === undefined) {
    return {}
  }
  return { data }
}

export const resend: AppResend = createAppResend({
  emails: {
    send: sendThroughSdk,
  },
})
