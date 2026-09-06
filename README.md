# SaaSy Land

A TanStack Start application for Cloudflare Workers, with React, TypeScript, Vite+, Better Auth, Drizzle and D1, TanStack Query and Form, use-intl, Fumadocs, Resend, and Polar.

The landing page, admin console, customer area, authentication flows, blog, documentation, and translations in nine languages share one application. Layouts and presentation components retain the existing design.

## Local development

Use Bun 1.4 and Node 24 or newer. Node is required by Vite+ and the SQLite test harness.

```sh
bun install
cp .env.example .env.development
# Set AUTH_SECRET, VITE_APP_URL, and the integrations you use.
bun run db:migrate:development
bun run dev
```

Development uses the preview D1 and KV bindings through Cloudflare's remote bindings, matching React Projects. Sign in with Wrangler before starting development. `AUTH_SECRET` must be a long random value; generate one with `openssl rand -base64 48`. OAuth, email, and payments require their respective provider credentials. Keep Polar in sandbox mode during development.

`.env.development`, `.env.preview`, and `.env.production` are ignored. `VITE_APP_URL` is public and embedded during the corresponding Vite build. Other values are Worker secrets; access them through `env` from `cloudflare:workers` in server code. Use `.env.test` only for isolated tests and CI.

## Organization

```text
content/                         Localized MDX documentation and blog posts
messages/{locale}/           Dotted translation namespaces
src/
  routes/                        Flat TanStack file routes, loaders, guards, and HTTP handlers
  router.tsx                     Per-request QueryClient, SSR integration, and URL rewrites
  server.ts                      Cloudflare Worker entry and locale middleware
  integrations/{vendor}/         Vendor setup, adapters, and shared integration helpers
  modules/{feature}/             Schemas, validation, constants, and use-cases/*.ts
  presentation/
    branding/                    Application identity and public URL
    components/shadcn/           UI primitives
    components/custom/           Feature and shared components
    emails/                      Email templates
    styles/                      CSS and locally served font declarations
  providers/                     Application-wide React providers
  data/                          Marketing configuration and admin demo data
  hooks/                         Shared React hooks
  lib/                           Shared utilities
  platform/testing/              Vitest RPC bridge, local bindings, and render helpers
```

Feature components, constants, types, and hooks stay beside their feature. Routes coordinate rendering and loading. Use cases export native `createServerFn` functions and query or mutation options. Protected functions check authorization themselves, in addition to route guards. Keep database and provider imports inside the server boundary.

`bun run skills:sync` restores the skills lockfile into vendor groups under `.agents/skills` and links them into `.claude/skills`, following the reference project's layout. Cloudflare supplies the Workers, Wrangler, and performance skills; TanStack supplies Start and Table guidance. Start skills live under `tanstack/start`. The obsolete Next.js, Vercel, and removed integration skills are excluded from both the lockfile and sync mappings. The reference project's older community Start skill is replaced with current guidance from the official TanStack repository.

The supported locales match React Projects: `en-US`, `de-DE`, `es-ES`, `fr-FR`, `it-IT`, `ja-JP`, `pl-PL`, `pt-BR`, and `uk-UA`. English uses unprefixed URLs; every other language uses its full locale prefix, such as `/de-DE` or `/pl-PL`. Short language aliases redirect to their canonical equivalents. Routes declare their message namespaces and preload them through TanStack Query. The locale cookie keeps server-function requests in the active language. Email namespaces are loaded only on the server.

## Verification

```sh
bun run check              # Message parity, formatting, lint, and types
bun run test               # Unit, integration, and component tests
bun run test:coverage      # Coverage gate
bun run build:preview      # Worker build, public-page prerendering, artifact checks
bun run test:e2e:install
bun run test:e2e           # Chromium and WebKit
```

Tests run through Vite+ and retain separate node, integration, and component projects. The RPC bridge runs TanStack's real validation and middleware pipeline. The D1 test adapter executes the checked-in SQLite migrations; browser tests build against `.env.test` and separate local Cloudflare test bindings. Tests never require a remote database. External provider calls must be mocked when exercising mutations.

## Cloudflare deployment

`wrangler.jsonc` declares development, preview, and production, with their D1 and KV bindings and required secret names. Development shares the preview bindings. When using a different Cloudflare account, provision replacement bindings and update the matching environment:

```sh
bunx wrangler login
bunx wrangler d1 create saasyland_com_preview
bunx wrangler kv namespace create CACHE --env preview
# Update preview IDs, then configure .env.preview with its URL and secrets.
bun run db:migrate:preview
bun run deploy:preview
```

Repeat for production using `saasyland_com_production`, `--env production`, `.env.production`, `db:migrate:production`, and `deploy:production`. Deployment scripts reject placeholder IDs. Migrations and deployments are explicit operations; installing dependencies and building do not mutate remote resources. Configure your custom domain in Cloudflare and use its HTTPS URL as `VITE_APP_URL` before the production build. Configure OAuth callbacks under `/api/auth/callback/{provider}` and Polar webhooks under `/api/auth/polar/webhooks`.

`bun run db:generate` creates SQLite migrations from module schemas. Review the SQL and commit it with the schema change, then apply locally before applying to a remote environment. Drizzle Studio and introspection use optional `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, and `CLOUDFLARE_ACCESS_TOKEN` credentials.

Existing PostgreSQL data needs an explicit export and import into the new D1 schema. The migration replaces the database engine and migrations; it does not transfer deployed production data.

Browser tests use `src/platform/testing/wrangler.jsonc`, selected by the test scripts with `E2E=true`. This configuration has local bindings, a provider-mocking entry point, and separate storage under `.wrangler/test`. The scripts run `db:migrate:test` and `db:seed:test` before building, then load the dummy values from `.env.test`. No deployed test environment or Cloudflare account is needed. Preview and production Workers run a daily schedule to remove expired D1 rate-limit counters.

## Localized content

Every supported locale has a complete message catalogue, email templates, blog posts, documentation, and navigation metadata. Keep message keys and ICU argument names identical across locales; use each language’s plural categories. Preserve MDX component names, code samples, link destinations, and content slugs. Translate frontmatter titles, descriptions, excerpts, FAQ entries, and visible component attributes as well as body text.

`bun run check:i18n` checks catalogue parity, message syntax and arguments, content-file completeness, navigation slugs, and executable code samples. `build:preview` also verifies that the home page and all four legal pages were prerendered in every locale. Locale changes preserve the current path, query, and fragment.

The `/privacy`, `/terms`, `/refunds`, and `/licence` pages describe SaaSy Land’s account, newsletter, payment, and licensing arrangements. Refund wording preserves mandatory consumer rights, including the conditions for withdrawal from digital-content contracts described in the [EU consumer guidance](https://europa.eu/youreurope/business/selling-in-eu/selling-goods-services/ecommerce-distance-selling/index_en.htm).

## Website and commercial product licences

This website's source code and associated technical documentation, including its sign-in, checkout, and customer licence-management implementation, remain [MIT licensed](LICENSE.md). Previous MIT releases keep their permissions. A purchase is not required to reuse that code under MIT. The MIT grant excludes SaaSy Land's original logos and brand artwork and grants no rights to the SaaSy Land name or other trademarks. Generic interface components remain covered; third-party assets retain their own licences. Reuse must not imply that a fork is the official SaaSy Land service or has our endorsement.

The SaaSy Land CLI lives in a separate, private repository. Its proprietary code and private templates are covered by the [Commercial Licence](https://saasyland.com/licence). A purchase and valid key are required to install and use the CLI. Customers may edit and commercially deploy generated applications within their package; they may not modify or redistribute the proprietary CLI or resell private templates as starter kits, subject to mandatory legal exceptions. Generated applications do not require a runtime licence key.

Polar issues a licence-key benefit after purchase. Configure that benefit on each paid product and set the advertised activation limit in Polar. The authenticated checkout and verified webhook handlers associate the purchase and issued key with the customer; `/app/license` displays the key and manages machine activations. Configure the checkout to present the applicable terms and commercial licence before payment. Record any legally required digital-content delivery consent separately from agreement to those terms.

The private CLI repository must carry that commercial agreement in its own `LICENSE.md` and enforce installation, activation, and use against the licensing provider. Website code and licence text alone do not enforce CLI access. Keep provider credentials on the server, preserve third-party and historical MIT notices, and review the commercial agreement and checkout with a software-licensing lawyer before selling the product. Copying historically MIT-licensed code into a private repository does not remove the public's existing permissions.
