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
    if (url.pathname === "/__test/newsletter" && request.method === "GET") {
      const email = url.searchParams.get("email")
      if (email === null || !email.endsWith("@example.test")) {
        return Response.json({ error: "A test email address is required" }, { status: 400 })
      }
      const subscriber = await env.DB.prepare(
        "SELECT status, unsubscribe_token AS unsubscribeToken, unsubscribed_at AS unsubscribedAt FROM newsletter_subscriber WHERE email = ?",
      )
        .bind(email)
        .first()
      return Response.json(subscriber)
    }

    applicationModule ??= loadTestApplication()
    const { default: application } = await applicationModule
    return application.fetch(request, env, context)
  },
} satisfies ExportedHandler<Cloudflare.Env>
