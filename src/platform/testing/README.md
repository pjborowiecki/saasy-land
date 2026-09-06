# Testing

All **suites** live next to the code under `src/**/__test__/`. This folder is only Vitest **process wiring** that cannot belong to one feature (setup, global module aliases, cross-cutting request URL helpers).

## Where to look

| Kind        | Location                                | Vitest project | Marker                 |
| ----------- | --------------------------------------- | -------------- | ---------------------- |
| Unit        | `src/**/__test__/*.test.ts`             | `node`         | `.test.ts`             |
| Component   | `src/**/__test__/*.component.test.tsx`  | `component`    | `.component.test.tsx`  |
| Integration | `src/**/__test__/*.integration.test.ts` | `integration`  | `.integration.test.ts` |
| E2E         | `e2e/specs/**/*.spec.ts`                | Playwright     | `.spec.ts`             |

**Rule:** open the module → open `__test__/`. Owner-specific helpers and fixtures live there too (e.g. auth harness beside auth, i18n fixtures beside use-intl).

### Entity schema tests (Drizzle + Zod)

Colocate tests with the module they cover. Name files after the **source file**, not a generic `schemas.test.ts`:

| Source file          | Drizzle / table tests     | Zod (drizzle-zod) tests |
| -------------------- | ------------------------- | ----------------------- |
| `{entity}.schema.ts` | `{entity}.schema.test.ts` | —                       |
| `{entity}.zod.ts`    | —                         | `{entity}.zod.test.ts`  |

Examples: `verification.zod.test.ts`, `user.schema.test.ts`. Cross-table and D1 integration checks live in `src/integrations/drizzle-orm/__test__/`.

Form / API validation schemas keep their own names (e.g. `auth.zod.test.ts` beside `auth.zod.ts`).

### What belongs in `platform/testing/`

- `vitest-env.d.ts` — Vitest + jest-dom globals for TypeScript
- Test env + jest-dom setup live in root `vite.config.ts` (`test.env`, `test.setupFiles`)
- `mocks/cloudflare.ts` and `mocks/wrksz-themes.ts` — local binding and theme adapters used across suites
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

## Ownership

Routes in `src/routes/` compose pages and preload queries. Feature views live in `src/presentation/components/custom/{feature}/`, with components, sections, constants, hooks and types beside their owner. Shared marketing and demo records live in `src/data/`; executable utilities live in `src/lib/` or a feature's `lib/` folder.

Use cases live in `src/modules/{feature}/use-cases/`. They validate inputs and enforce their own authorization through native TanStack Start middleware. Vendor setup and adapters live in `src/integrations/{vendor}/`. Presentation components consume query/mutation options and never import database or provider clients directly.

## Auth integration harness

`src/integrations/better-auth/__test__/fixtures/auth.test-instance.ts` wraps Better Auth’s `getTestInstance` (Vitest-only). Do not import `better-auth/test` outside Vitest—it registers `afterAll` hooks at module load.

Session fixtures for action/use-case tests: `__test__/fixtures/auth.session.fixture.ts`.

`auth.signup.integration.test.ts` exercises the production signup server function, Better Auth configuration, database adapter, email templates, and Resend SDK. It captures outbound HTTP requests to check that verification delivery finishes before fresh or repeated signup returns.

Browser tests use `worker.ts` and `mocks/providers.ts` with isolated local bindings. The test Worker exposes captured email payloads at `/__test/emails?to=...`, allowing Playwright to follow the actual verification link. This endpoint and provider interception belong only to the test entry; deployed builds use `src/server.ts`.
