# SaaSy Land 2.0

**A production-oriented full-stack SaaS starter** — Next.js App Router, Better Auth, Neon Postgres, modular use-cases, and a real admin product shell.

Built as a **modular monolith**: thin route delivery, domain modules with use-cases, shared presentation, and explicit integrations — not a grab-bag of demos.

> Open source · MIT · [saasyland.com](https://saasyland.com)

## Links

| Resource      | URL                                                                   |
| ------------- | --------------------------------------------------------------------- |
| Live demo     | [saasyland.com](https://saasyland.com/en-US)                          |
| Documentation | [saasyland.com/docs](https://saasyland.com/en-US/docs)                |
| Blog          | [saasyland.com/blog](https://saasyland.com/en-US/blog)                |
| Issues        | [GitHub Issues](https://github.com/pjborowiecki/saasyland.com/issues) |

## What’s included

- **Auth** — Better Auth (email/password, GitHub & Google OAuth, email verification, password reset, TOTP 2FA + backup codes, admin RBAC, impersonation, session revoke)
- **Data** — Neon Postgres + Drizzle ORM (migrations, pooled runtime URL, typed schema)
- **Admin** — Dashboard, users (live list + DataTable + URL tabs), products, categories, settings, sessions, analytics shell, payments/pricing/courses/blog/landing UI shells
- **Customer app** — Protected `/app` area after sign-in
- **Marketing** — Landing, blog (Fumadocs MDX), docs site, legal pages
- **i18n** — next-intl (`en-US`, `pl-PL`), message catalogs, locale switch
- **URL state** — nuqs (typed parsers, server cache, adapter defaults)
- **UI** — shadcn + React Aria, TanStack Table DataTable, theme + branding
- **Email** — Resend + React Email templates
- **Cache / edge** — Upstash Redis, Next.js Cache Components, `proxy.ts` auth + i18n
- **Quality** — Strict TypeScript, Vitest (unit / component / integration, 100% coverage gates), Playwright e2e, Vite+ lint/format, agent skills under `.agents/skills`

## Architecture

```text
src/
├── proxy.ts                 # Auth + i18n middleware (Next.js proxy)
├── routes.ts                # Shared path constants (ROUTES)
├── app/[locale]/            # Route groups: (landing) (auth) (app) (admin) (docs) (blog)
├── app/(api)/api/           # Elysia catch-all (/api/auth, /api/search, …)
├── modules/
│   ├── _core/               # Domain errors, locale/currency catalogs, shared utils
│   ├── account/             # Account settings use-cases
│   ├── user/                # Admin user management use-cases
│   ├── session/             # Session list / revoke
│   ├── two-factor/          # 2FA enable / verify / disable
│   ├── verification/        # Email verify + password reset
│   ├── product/             # Product catalog use-cases
│   └── category/            # Category use-cases
├── presentation/            # Shared UI (shadcn, custom DataTable, theme, branding)
├── providers/               # Theme, nuqs, docs, translations, tooltip
├── integrations/            # better-auth, next-intl, fumadocs, resend, redis, next-safe-action
├── platform/                # env (t3), db (Drizzle), testing helpers
├── hooks/                   # Shared React hooks
├── utils/                   # cn() and small helpers
└── types/                   # Shared TS helpers
```

### Dependency rules

| Layer                 | May depend on                                                      | Must not                                     |
| --------------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| `modules/*` use-cases | `_core`, Better Auth / DB via integrations & platform, validations | UI components, route paths as business rules |
| `presentation`        | integrations (i18n/nav), utils                                     | Drizzle, auth server secrets                 |
| `app` pages           | use-cases, presentation, `routes`                                  | Raw SQL / leaking infra into UI              |
| `integrations`        | vendor SDKs, platform env                                          | Admin page markup                            |
| `platform`            | env, DB drivers                                                    | Feature UI                                   |

**Pattern:** RSC pages and server actions call **use-cases** (next-safe-action + permission checks). UI stays thin. Domain errors (`FORBIDDEN`, `NOT_FOUND`, …) live in `modules/_core/errors`.

### One source of truth

| Concern                  | Location                                      |
| ------------------------ | --------------------------------------------- |
| Role codes & permissions | `integrations/better-auth/auth.access.ts`     |
| Route path constants     | `src/routes.ts`                               |
| Enabled locales          | `integrations/next-intl/i18n.config.ts`       |
| Env validation           | `platform/env`                                |
| DB schema / migrations   | `platform/db`                                 |
| Users URL tab parsers    | `app/.../admin/users/_lib/search-params.ts`   |
| Admin sidebar items      | `app/.../admin/_lib/sidebar.ts`               |
| Branding / theme         | `presentation/branding`, `presentation/theme` |
| Docs content             | `integrations/fumadocs/content/docs`          |
| Blog content             | `integrations/fumadocs/content/blog`          |

## Tech stack

| Area                      | Choice                                                    |
| ------------------------- | --------------------------------------------------------- |
| Framework                 | Next.js 16 (App Router, Cache Components, React Compiler) |
| Runtime / package manager | Bun                                                       |
| Auth                      | Better Auth                                               |
| Database                  | Neon Postgres + Drizzle ORM                               |
| Cache                     | Upstash Redis                                             |
| UI                        | Tailwind CSS, shadcn/ui, React Aria / Base UI             |
| Tables                    | TanStack Table (`presentation/.../data-table`)            |
| Forms                     | React Hook Form + Zod                                     |
| URL state                 | nuqs                                                      |
| i18n                      | next-intl                                                 |
| Docs / blog               | Fumadocs MDX                                              |
| Email                     | Resend + React Email                                      |
| Server actions            | next-safe-action                                          |
| HTTP API                  | Elysia (`/api` catch-all; Better Auth + search)           |
| Tooling                   | Vite+ (`vp`), Vitest, Playwright, TypeScript strict       |
| Deploy                    | Vercel                                                    |

## Quick start

```bash
bun install
cp .env.example .env.local   # fill secrets; set NEXT_PUBLIC_APP_URL
bun run db:migrate
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Essential scripts

| Script                                             | Purpose                                 |
| -------------------------------------------------- | --------------------------------------- |
| `bun run dev`                                      | Next.js dev server                      |
| `bun run build` / `start`                          | Production build / serve                |
| `bun run check`                                    | i18n check + lint/format/type via Vite+ |
| `bun run test`                                     | Vitest (all projects)                   |
| `bun run test:coverage`                            | Coverage (global 100% thresholds)       |
| `bun run test:e2e:smoke`                           | Playwright smoke                        |
| `bun run db:generate` / `db:migrate` / `db:studio` | Drizzle workflow                        |
| `bun run deploy:preview` / `deploy:prod`           | Vercel deploy                           |

See in-app **Documentation → Tooling → Scripts** (`/docs/tooling/scripts`) for the full script map.

### Environment

Copy `.env.example` → `.env.local`. Minimum for local:

- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL` (Neon pooled)
- `AUTH_SECRET` (≥ 64 chars)
- OAuth: `GITHUB_*`, `GOOGLE_*`
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` (Upstash)
- `RESEND_API_KEY` / `RESEND_EMAIL_FROM`

Validated at runtime by `@t3-oss/env-nextjs` in `src/platform/env`.

## Documentation

In-app docs live under `/docs` (Fumadocs). Content source:

`src/integrations/fumadocs/content/docs`

Chapters (in sidebar order): project, getting started, architecture, guides, features (including planned areas like payments), integrations, UI system, tooling, and reference. Expand each page as the product grows — the tree is intentionally comprehensive so nothing important is missing from the map.

## Current product surface

| Area                                        | Status                                            |
| ------------------------------------------- | ------------------------------------------------- |
| Auth + 2FA + verification                   | Live                                              |
| Admin users DataTable (real DB)             | Live                                              |
| Products / categories use-cases             | Live (admin UI evolving)                          |
| Sessions / settings / account               | Live                                              |
| Admin payments, courses, pricing, analytics | UI shells / mocks — docs describe intended design |
| Organizations / multi-tenant                | Planned — documented under Features               |
| Stripe / billing                            | Planned — documented under Features → Payments    |

## Philosophy

1. **Colocate by owner** — no mega `lib/` dump
2. **Use-cases at the edge** — permissions + orchestration in one place
3. **Thin pages** — RSC composes; business rules stay in modules
4. **Typed URL state** — shared nuqs parsers for client + server
5. **One catalog per concept** — roles, locales, routes, env
6. **Test what you ship** — high coverage on modules and shared UI

---

MIT License · [SaaSy Land](https://saasyland.com) · [Piotr Borowiecki](https://pjborowiecki.com)
