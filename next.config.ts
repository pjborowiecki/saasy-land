import type { NextConfig } from "next"

import { createMDX } from "fumadocs-mdx/next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  cacheComponents: true,
  typedRoutes: true,
  experimental: { rootParams: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" }],
  },
}

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/integrations/next-intl/i18n.request.ts",
  experimental: { createMessagesDeclaration: "./src/integrations/next-intl/messages/en-US.json" },
})

const withMDX = createMDX({
  configPath: "./src/integrations/fumadocs/fumadocs.config.ts",
})

export default withNextIntl(withMDX(nextConfig))
