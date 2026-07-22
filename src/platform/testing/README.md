# Testing

All **suites** live next to the code under `src/**/__test__/`. This folder is only Vitest **process wiring** that cannot belong to one feature (setup, global module aliases, cross-cutting request URL helpers).

## Where to look

| Kind        | Location                                | Vitest project | Marker                 |
| ----------- | --------------------------------------- | -------------- | ---------------------- |
| Unit        | `src/**/__test__/*.test.ts`             | `node`         | `.test.ts`             |
| Component   | `src/**/__test__/*.component.test.tsx`  | `component`    | `.component.test.tsx`  |
| Integration | `src/**/__test__/*.integration.test.ts` | `integration`  | `.integration.test.ts` |
| E2E         | `e2e/specs/**/*.spec.ts`                | Playwright     | `.spec.ts`             |

**Rule:** open the module → open `__test__/`. Owner-specific helpers and fixtures live there too (e.g. auth harness beside auth, i18n fixtures beside next-intl).

### Entity schema tests (Drizzle + Zod)

Colocate tests with the module they cover. Name files after the **source file**, not a generic `schemas.test.ts`:

| Source file          | Drizzle / table tests     | Zod (drizzle-zod) tests |
| -------------------- | ------------------------- | ----------------------- |
| `{entity}.schema.ts` | `{entity}.schema.test.ts` | —                       |
| `{entity}.zod.ts`    | —                         | `{entity}.zod.test.ts`  |

Examples: `verification.zod.test.ts`, `user.schema.test.ts`. Cross-table barrel checks (full `platform/db/schema`) live in `src/platform/db/__test__/schema.test.ts`.

Form / API validation schemas keep their own names (e.g. `auth.zod.test.ts` beside `auth.zod.ts`).

### What belongs in `platform/testing/`

- `vitest-env.d.ts` — Vitest + jest-dom globals for TypeScript
- Test env + jest-dom setup live in root `vite.config.ts` (`test.env`, `test.setupFiles`)
- `mocks/bun.ts`, `mocks/next-font-google.ts`, `mocks/next-navigation.ts`, `mocks/wrksz-themes.ts` — Vite aliases used across many suites
- `lib/` — small shared helpers imported from many suites (URL/cookie helpers, nullable DB fixtures, component test utilities)

Everything else is colocated with its owner.

## Commands

```bash
bun run test                 # full Vitest suite
bun run test:unit            # --project node
bun run test:component       # --project component
bun run test:integration     # --project integration
bun run test:e2e:smoke       # Playwright smoke
```

Use `bun run test`, not `bun test` (see `scripts/bun-test-guard/`).

## Presentation boundaries (CA / DDD)

Route-local `_components` under `src/app/**` are **correct and acceptable**. They do not break Clean Architecture when the dependency rule holds.

| Location                                                      | Role                                                                                                                                                                           |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/app/**`                                                  | Delivery / routing. Thin pages + **route-private** UI in `_components` (Next: `_` = not a route).                                                                              |
| `src/presentation/components`, `providers`, `styles`, `utils` | **Shared** UI kit and app-wide providers only — not use cases, not server actions.                                                                                             |
| `src/modules/*/application`                                   | Commands, queries, handlers (CQRS-lite).                                                                                                                                       |
| `src/modules/*/infrastructure`                                | Persistence, email, auth adapters — concrete tech.                                                                                                                             |
| `src/modules/*/domain`                                        | Aggregates, VOs, domain errors — no React, no Next.                                                                                                                            |
| `src/modules/shared-kernel`                                   | Cross-context codes/types (`Currency`, `Timezone`, `Locale`, `Result`, …). See its README.                                                                                     |
| Colocated app knobs                                           | Locales → next-intl; routes → `src/routes.ts`; post-auth paths → `src/post-auth.ts`; theme/branding/utils → presentation; roles → `RoleCode`; route fixtures → segment `_lib`. |

Rules of thumb:

- **Reuse across routes / design system** → `presentation/`
- **Used by one route segment only** → stay in that segment’s `_components`
- **RSC pages** call application handlers directly and pass concrete deps (`new DrizzleProductRepository(db)`) — no DI container; add a `"use server"` action only when a client mutation needs one
- Never let `_components` or pages talk to Drizzle / infra tables directly
- Never let domain/application import from `app` or `presentation`

## Auth integration harness

`src/integrations/better-auth/__test__/fixtures/auth.test-instance.ts` wraps Better Auth’s `getTestInstance` (Vitest-only). Do not import `better-auth/test` outside Vitest—it registers `afterAll` hooks at module load.

Session fixtures for action/use-case tests: `__test__/fixtures/auth.session.fixture.ts`.
