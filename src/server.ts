import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { handleLocaleMiddleware } from "~/src/integrations/use-intl/i18n.middleware"
import { shouldIgnorePath } from "~/src/integrations/use-intl/i18n.paths"

import { PPP_ATTRIBUTE, PPP_PERCENT, pppMultiplierKey } from "~/src/modules/_core/constants/pricing"
import { COUNTRY_HEADER } from "~/src/modules/license/license.ppp"

import { serializeCookie } from "~/src/lib/cookie"

export interface RequestContext {
  env: Cloudflare.Env
  waitUntil: (promise: Promise<unknown>) => void
  passThroughOnException: () => void
}

const HTTP_NOT_FOUND = 404

const PPP_PAGES: ReadonlySet<string> = new Set(
  I18N.SUPPORTED_LOCALES.map((locale) => (locale === I18N.DEFAULT_LOCALE ? "/" : `/${locale}`)),
)

const withParityBand = (asset: Response, multiplierKey: number): Response =>
  new HTMLRewriter()
    .on("html", {
      element: (element) => {
        element.setAttribute(PPP_ATTRIBUTE, String(multiplierKey))
      },
    })
    .transform(asset)

const render = async (
  request: Request,
  env: Cloudflare.Env,
  ctx: Pick<ExecutionContext, "waitUntil" | "passThroughOnException">,
): Promise<Response> => {
  if ((request.method === "GET" || request.method === "HEAD") && !shouldIgnorePath(new URL(request.url).pathname)) {
    const asset = await env.ASSETS.fetch(request)
    if (asset.status !== HTTP_NOT_FOUND) {
      const multiplierKey = pppMultiplierKey(request.headers.get(COUNTRY_HEADER) ?? undefined)
      const isParityPage = PPP_PAGES.has(new URL(request.url).pathname)
      return isParityPage && multiplierKey !== PPP_PERCENT ? withParityBand(asset, multiplierKey) : asset
    }
  }
  const { default: handler } = await import("@tanstack/react-start/server-entry")
  return handler.fetch(request, {
    context: { env, passThroughOnException: ctx.passThroughOnException.bind(ctx), waitUntil: ctx.waitUntil.bind(ctx) },
  })
}

const server = {
  async fetch(request: Request, env: Cloudflare.Env, ctx: Pick<ExecutionContext, "waitUntil" | "passThroughOnException">) {
    const { redirect, setCookie } = handleLocaleMiddleware(request)
    if (redirect) {
      return redirect
    }
    const response = await render(request, env, ctx)
    if (!setCookie) {
      return response
    }
    const mutable = new Response(response.body, response)
    mutable.headers.append(
      "Set-Cookie",
      serializeCookie({ name: I18N.COOKIE_NAME, options: { secure: new URL(request.url).protocol === "https:" }, value: setCookie.value }),
    )
    return mutable
  },
} satisfies ExportedHandler<Cloudflare.Env>

export default server
