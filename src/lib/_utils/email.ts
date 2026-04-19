import { env } from "~/src/environment"

export async function sendEmail(body: Record<string, unknown>) {
  const url = env.CLOUDFLARE_EMAIL_SERVICE_URL
  const token = env.CLOUDFLARE_API_TOKEN

  if (!url || !token) {
    throw new Error("Set CLOUDFLARE_EMAIL_SERVICE_URL and CLOUDFLARE_API_TOKEN")
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(`Email send failed ${res.status}: ${JSON.stringify(data)}`)
  }

  return data
}
