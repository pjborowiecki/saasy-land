# SaaSy Land 2.0

**A modular SaaS starter for modern full-stack apps** — Clean Architecture / DDD, Next.js App Router, and strict TypeScript.

Built for production shape over grab-bag boilerplate: bounded contexts, colocated app knobs, and clear dependency rules.

> Open source. Production-oriented. Maintained as a real product codebase.

## Links

- **[Demo](https://saasyland.com/en)** — live app
- **[Quick start guide](https://saasyland.com/en/blog/quick-start-guide)** — run locally
- **[Documentation](https://saasyland.com/en/docs)** — setup and usage
- **[Premium content](https://saasyland.com/en/premium)** — deeper walkthroughs and integration guides

## Architecture

The app is a **modular monolith**: delivery (`app`, `proxy`, `routes`, `post-auth`) sits on top of **modules** (domain → application → infrastructure), with **presentation**, **integrations**, and **platform** as supporting layers.

```text
src/
├── proxy.ts                 # Edge/auth + i18n middleware entry
├── routes.ts                # Cross-cutting path constants
├── post-auth.ts             # Maps auth destination intents → paths
├── app/                     # Next.js routes — thin pages + route-private `_components` / `_lib`
├── modules/
│   ├── shared-kernel/       # Cross-context VOs & types (currency, locale, Result, …)
│   ├── identity-access/     # Auth, users, roles, permissions, email
│   └── catalog/             # Products / catalog bounded context
├── presentation/            # Shared UI kit, providers, theme, branding, `utils` (cn)
├── integrations/            # Vendor adapters (next-intl, fumadocs, redis, …)
├── platform/                # Env, DB, test process wiring
├── hooks/                   # Shared React hooks
└── types/                   # Ambient / shared TS helpers
```

### Dependency rule

| Layer                         | May depend on                                             | Must not                                                   |
| ----------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| `modules/*/domain`            | shared-kernel domain, same-context domain                 | React, Next, Drizzle, presentation, platform, integrations |
| `modules/*/application`       | domain, shared-kernel, own ports                          | infrastructure, presentation, app                          |
| `modules/*/infrastructure`    | application/domain, platform, integrations                | presentation URLs / UI                                     |
| `presentation`                | integrations (navigation/i18n), branding/theme/utils      | Drizzle, module infrastructure                             |
| `app` / `proxy` / `post-auth` | application use cases, presentation, routes, auth intents | direct DB / infra tables from UI                           |

RSC pages call application handlers with concrete deps (e.g. `new DrizzleProductRepository(db)`) — no DI container. Add a `"use server"` action only when a client mutation needs one.

### One source of truth (where to add / change things)

| Concern                           | Location                                               | Notes                                                                                       |
| --------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Role codes (`admin` / `customer`) | `modules/identity-access/domain/value-objects/role.ts` | `RoleCode`, `RoleName`, `ROLE_VALUES`, `Role` VO — **only** place that defines role strings |
| Permission actions / resources    | `modules/identity-access/domain/permissions.ts`        | Reuses `RoleCode`; do not redefine roles here                                               |
| Post-auth **intent**              | `auth.access.ts` → `getPostAuthDestination`            | Returns `"admin" \| "app"` — no URLs                                                        |
| Post-auth **paths**               | `src/post-auth.ts`                                     | Maps intent → `ROUTES`; used by proxy + auth UI                                             |
| Route path constants              | `src/routes.ts`                                        | Shared path strings only                                                                    |
| Enabled locales / cookie          | `integrations/next-intl/i18n.config.ts`                | Product-enabled locales                                                                     |
| Theme defaults                    | `presentation/theme/`                                  |                                                                                             |
| Branding                          | `presentation/branding/`                               |                                                                                             |
| `cn()` / class merge              | `presentation/utils/`                                  | shadcn `utils` alias                                                                        |
| Send email                        | `identity-access/infrastructure/email/send-email.ts`   |                                                                                             |
| Blog post helpers                 | `app/[locale]/(blog)/_lib/posts.ts`                    |                                                                                             |
| Landing static copy data          | `app/[locale]/(landing)/_lib/`                         | tech stack, testimonials                                                                    |
| Admin UI fixtures                 | `app/[locale]/(admin)/admin/_lib/mock-data.ts`         | Temporary mocks until real queries own the data                                             |
| Admin sidebar                     | `app/[locale]/(admin)/admin/_lib/sidebar.ts`           |                                                                                             |
| Secrets / app URL                 | `platform/env` + `.env.local`                          | e.g. `NEXT_PUBLIC_APP_URL`                                                                  |

**Rules of thumb**

- Domain catalogs answer “is this value _valid_?”
- App knobs answer “what does _this product_ enable?” — colocate with the owner
- Auth never imports `routes` / URLs; delivery maps intents
- Prefer route-private `_lib` over a global `src/data` or `src/lib` dump

See also `src/modules/shared-kernel/README.md` and `src/platform/testing/README.md`.

## Feature highlights

- Modular contexts: **identity-access**, **catalog**, **shared-kernel**
- Auth with [Better Auth](https://better-auth.com) (credentials, OAuth, 2FA, RBAC-oriented permissions)
- Neon Postgres + Drizzle ORM
- Admin shell + landing / auth / docs / blog route groups
- i18n via next-intl (enabled locales today: **en-US**, **pl-PL**; catalog is easy to extend)
- Docs with Fumadocs; email via Resend
- Shared UI (shadcn-style components, theme + locale switches)
- Strict TypeScript; Vitest (unit / component / integration) + Playwright e2e
- Validated env with `@t3-oss/env-nextjs`

## Tech stack

| Area               | Technologies                                                                                                                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | [Next.js](https://nextjs.org) (App Router)                                                                                                                                                               |
| Auth               | [Better Auth](https://better-auth.com)                                                                                                                                                                   |
| Data               | [Drizzle ORM](https://orm.drizzle.team), [Neon Postgres](https://neon.tech), [Upstash Redis](https://upstash.com)                                                                                        |
| UI & forms         | [TanStack Table](https://tanstack.com/table/latest), [React Hook Form](https://react-hook-form.com), [Zod](https://zod.dev), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) |
| i18n & docs        | [next-intl](https://next-intl.dev), [Fumadocs](https://fumadocs.dev), [Nuqs](https://nuqs.47ng.com)                                                                                                      |
| Email              | [Resend](https://resend.com)                                                                                                                                                                             |
| Language & tooling | [TypeScript](https://typescriptlang.org), [Bun](https://bun.sh), [Vite+](https://viteplus.dev) / Vitest, [Playwright](https://playwright.dev)                                                            |

## Quick start

```bash
bun install
cp .env.example .env.local   # fill secrets; set NEXT_PUBLIC_APP_URL
bun run db:migrate
bun run dev
```

Useful scripts: `bun run check`, `bun run test`, `bun run test:e2e:smoke`, `bun run db:studio`.

## Philosophy

- **Colocate by owner** — no mega-config or grab-bag `lib`/`data`
- **Keep domain pure** — valid codes and rules stay in modules / shared-kernel
- **Thin delivery** — `app` and `_components` orchestrate; they don’t own business rules or Drizzle
- **Prefer explicit wiring** — concrete repositories at the edge over frameworks of indirection
- **One catalog per concept** — roles, locales, routes, and intents each have a single obvious home

SaaSy Land is meant to save months of structure and plumbing while staying readable enough to evolve into your product.

---

MIT License · [SaaSy Land](https://saasyland.com) · [Piotr Borowiecki](https://pjborowiecki.com)
