import type { NextConfig } from "next"

import { createMDX } from "fumadocs-mdx/next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
    rootParams: true,
  },
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com", pathname: "/**", protocol: "https" },
      { hostname: "i.pravatar.cc", pathname: "/**", protocol: "https" },
    ],
  },
  reactCompiler: true,
  reactStrictMode: true,
  serverExternalPackages: ["better-auth"],
  typedRoutes: true,
}

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/integrations/next-intl/i18n.request.ts",
})

const withMDX = createMDX({
  configPath: "./src/integrations/fumadocs/fumadocs.config.ts",
})

export default withNextIntl(withMDX(nextConfig))
