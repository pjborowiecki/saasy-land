import { getSentEmails, installProviderMocks } from "~/src/platform/testing/mocks/providers"

import type * as applicationModuleType from "~/src/server"

installProviderMocks()

const loadTestApplication = async (): Promise<typeof applicationModuleType> => {
  const { auth } = await import("~/src/integrations/better-auth/auth.server")
  // The browser suite uses a separate local port without changing the deployed host allowlist.
  auth.options.baseURL.allowedHosts.push("localhost:3020", "127.0.0.1:3020")
  const { options } = await auth.$context
  if (typeof options.baseURL === "object") {
    options.baseURL.allowedHosts = auth.options.baseURL.allowedHosts
  }
  return import("~/src/server")
}

let applicationModule: ReturnType<typeof loadTestApplication> | null = null

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url)
    if (url.pathname === "/__test/emails" && request.method === "GET") {
      const recipient = url.searchParams.get("to")
      if (recipient === null || recipient.length === 0) {
        return Response.json({ error: "An email recipient is required" }, { status: 400 })
      }
      return Response.json(getSentEmails(recipient))
    }

    applicationModule ??= loadTestApplication()
    const { default: application } = await applicationModule
    return application.fetch(request, env, context)
  },
} satisfies ExportedHandler<Cloudflare.Env>
