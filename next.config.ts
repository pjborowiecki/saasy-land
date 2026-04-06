import type { NextConfig } from "next"

import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  cacheComponents: true,
  typedRoutes: true,
  experimental: { rootParams: true },
}

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/integrations/next-intl/i18n.request.ts",
  experimental: { createMessagesDeclaration: "./src/integrations/next-intl/messages/en-US.json" },
})

export default withNextIntl(nextConfig)
