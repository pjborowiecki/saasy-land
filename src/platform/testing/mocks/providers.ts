import * as zod from "zod"

/** External provider fixtures for the dedicated local Cloudflare test environment. */
const customers = new Map<string, Record<string, unknown>>()
const nativeFetch = globalThis.fetch
const recipientsSchema = zod.array(zod.string())
const resendEmailSchema = zod.object({
  from: zod.string(),
  html: zod.string(),
  subject: zod.string(),
  to: zod.union([zod.string(), recipientsSchema]),
})

interface CapturedEmail extends Omit<zod.infer<typeof resendEmailSchema>, "to"> {
  readonly id: string
  readonly idempotencyKey: string | null
  readonly to: string[]
}

const sentEmails: CapturedEmail[] = []

export const getSentEmails = (recipient: string): CapturedEmail[] => sentEmails.filter(({ to }) => to.includes(recipient))

const captureEmail = async (request: Request): Promise<Response> => {
  const payload = resendEmailSchema.parse(await request.json())
  const id = crypto.randomUUID()
  sentEmails.push({
    ...payload,
    id,
    idempotencyKey: request.headers.get("Idempotency-Key"),
    to: typeof payload.to === "string" ? [payload.to] : payload.to,
  })
  return Response.json({ id })
}

export const installProviderMocks = (): void => {
  globalThis.fetch = Object.assign(
    async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
      const request = new Request(input, init)
      const url = new URL(request.url)
      if (url.hostname === "api.resend.com") {
        return captureEmail(request)
      }
      if (url.hostname === "sandbox-api.polar.sh" && url.pathname.startsWith("/v1/customers")) {
        const id = url.pathname.split("/").findLast(Boolean)
        if (request.method === "GET") {
          const customer = id === undefined ? undefined : customers.get(id)
          if (customer !== undefined) {
            return Response.json(customer)
          }
          const email = url.searchParams.get("email")
          const items = [...customers.values()].filter((entry) => email === null || entry["email"] === email)
          return Response.json({ items, pagination: { max_page: 1, total_count: items.length } })
        }
        const body: unknown = await request.json()
        const fields = typeof body === "object" && body !== null ? body : {}
        const customerId = id !== undefined && customers.has(id) ? id : crypto.randomUUID()
        const customer = {
          avatar_url: null,
          billing_address: null,
          billing_name: null,
          created_at: new Date().toISOString(),
          deleted_at: null,
          email: "test@example.test",
          email_verified: false,
          id: customerId,
          metadata: {},
          modified_at: null,
          name: "Test User",
          organization_id: "00000000-0000-4000-8000-000000000003",
          tax_id: null,
          type: "individual",
          ...customers.get(customerId),
          ...fields,
        }
        customers.set(customerId, customer)
        return Response.json(customer)
      }
      return nativeFetch(request)
    },
    { preconnect: nativeFetch.preconnect },
  )
}
