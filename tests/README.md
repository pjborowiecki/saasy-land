# Testing

All unit and integration tests run through **Vite+** (`vp test`); browser tests use **Playwright**.

## Pyramid

| Layer           | Location                                     | Runner         | Purpose                                                              |
| --------------- | -------------------------------------------- | -------------- | -------------------------------------------------------------------- |
| **Unit**        | `src/**/*.test.ts`                           | Vitest (node)  | Pure functions, utilities, domain logic                              |
| **Integration** | `tests/integration/**/*.integration.test.ts` | Vitest (node)  | Cross-module behavior (i18n loading, auth access, locale resolution) |
| **Component**   | `tests/component/**/*.component.test.tsx`    | Vitest (jsdom) | Client UI with Testing Library                                       |
| **E2E**         | `e2e/specs/**/*.spec.ts`                     | Playwright     | Real browser flows against built app                                 |

## Commands

```bash
bun run test                 # full Vitest suite
bun run test:unit            # src/ only
bun run test:integration     # tests/integration/
bun run test:component       # tests/component/
bun run test:coverage        # Vitest + coverage thresholds
bun run test:changed         # Vitest for files changed since main
bun run test:e2e:smoke       # fastest browser smoke check
bun run test:e2e:pr          # PR browser suite (Chromium)
bun run test:e2e             # full browser matrix (Chromium + WebKit)
bun run test:e2e:install     # download Playwright browsers (run once after install/upgrade)
bun run test:all             # Vitest + smoke E2E
```

## Conventions

- **Colocate** unit tests with the module they cover: `src/lib/_utils/__test__/foo.test.ts` for helpers, or `foo.test.ts` next to integration modules when that fits better.
- **Suffix integration tests** with `.integration.test.ts` so intent is obvious.
- **Suffix component tests** with `.component.test.tsx` and add `/** @vitest-environment jsdom */` at the top of each file.
- **Keep E2E thin**: page objects in `e2e/pages/`, shared fixtures in `e2e/fixtures/test.ts`, specs in `e2e/specs/`.
- Prefer **behavior assertions** (roles, URLs, visible copy) over implementation details.

## Coverage

Coverage is configured in `vite.config.ts` under `test.coverage`.

- **Included:** `src/**/*.{ts,tsx}` application code
- **Excluded:** App Router pages, shadcn primitives, migrations, static messages, generated types, and test files themselves
- **Thresholds:** global floor (~25%) plus stricter gates on modules that already have tests (`i18n.utils`, `i18n.locale`, `src/lib/_utils`). Ratchet global thresholds up as coverage grows.

**Important:** 100% line coverage on included files is **not** the same as testing every user journey. Coverage measures whether executable lines in `src/` ran during Vitest—it does not prove sign-up, OAuth, sessions, or admin RBAC work end-to-end. Use the pyramid:

| Concern                                                                                                                          | Where it is tested                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Zod schemas, error mapping, RBAC helpers                                                                                         | `src/integrations/better-auth/__test__/`                                                                                              |
| Real Better Auth API flows (sign-up/in/out, verify, reset, change password, change email, plugins, roles, rate limits, sessions) | `tests/integration/better-auth/*.integration.test.ts` via `tests/helpers/auth-test-instance.ts` (`better-auth/test` in-memory SQLite) |
| API root greeting                                                                                                                | `tests/integration/api/api.integration.test.ts`                                                                                       |
| Auth form submit wiring (mocked client)                                                                                          | `tests/component/auth-forms.component.test.tsx`                                                                                       |
| Admin/auth UI primitives (badges, password rules, separators)                                                                    | `tests/component/admin-auth-ui.component.test.tsx`                                                                                    |
| Admin status color helpers                                                                                                       | `src/app/[locale]/(admin)/admin/_lib/__test__/status-colors.test.ts`                                                                  |
| Route protection redirects                                                                                                       | `tests/integration/proxy/proxy.integration.test.ts`                                                                                   |
| Auth pages reachable in browser                                                                                                  | `e2e/specs/auth*.spec.ts`                                                                                                             |

Path to **100% coverage** on included files:

1. Add unit tests for every pure helper under `src/lib/` and `src/integrations/**` that contains logic.
2. Add integration tests for request/config boundaries (i18n, auth, API handlers).
3. Add component tests only for client islands with interaction logic.
4. Use E2E for critical user journeys—not for line coverage.

Run `bun run test:coverage` locally and open `coverage/index.html` for gaps.

### Auth integration harness

`tests/helpers/auth-test-instance.ts` wraps Better Auth's official `getTestInstance` (Vitest-only). It mirrors production plugins (admin, anonymous, multi-session, 2FA), captures verification/reset/change-email payloads, and exposes helpers such as `signUpVerifyAndSignIn` and `promoteUserToAdmin`. **Do not** import `better-auth/test` outside Vitest—it registers `afterAll` hooks at module load time.

## CI

Pull requests and pushes to `main` run (`.github/workflows/ci.yml`):

1. Format, lint, typecheck, i18n parity
2. Vitest suite + coverage gate
3. Production build
4. Playwright PR suite (Chromium)

The nightly workflow runs the full Playwright matrix (Chromium + WebKit).

### E2E prerequisites

1. **Install browsers once** after `bun install` or any `@playwright/test` upgrade:
   ```bash
   bun run test:e2e:install
   ```
   Playwright downloads version-matched binaries (e.g. `webkit-2311`) into `~/Library/Caches/ms-playwright/`. If you see `Executable doesn't exist at .../webkit-*/pw_run.sh`, run the command above.
2. Ensure `.env.local` exists (Playwright starts `bun run dev` on port 3000 locally)
3. Prefer `bun run test:e2e:pr` for day-to-day checks; `bun run test:e2e` runs Chromium and WebKit

Page objects navigate with `waitUntil: "commit"` (see `APP_NAVIGATION_WAIT_UNTIL` in `e2e/pages/base-page.ts`) because Next.js dev mode often never reaches `load` or `domcontentloaded`—especially in WebKit. `waitForAppReady()` also waits for React Suspense streaming placeholders to resolve before asserting on async page content.

## Adding tests

**Unit example** — create `src/lib/_utils/__test__/foo.test.ts` for helpers under `_utils`.

**Integration example** — add `tests/integration/<domain>/<feature>.integration.test.ts`.

**E2E example** — extend page objects in `e2e/pages/`, import `test`/`expect` from `e2e/fixtures/test.ts`, add a spec under `e2e/specs/`.

Shared Vitest helpers live in `tests/helpers/` as named modules (no barrel `index.ts`):

- `test-request.ts` — `TEST_APP_URL` (from `env.NEXT_PUBLIC_APP_URL`), `createTestRequestUrl()`, `createAuthActionUrl()`, `createCookieHeader()`
- `auth-test-instance.ts` — Better Auth in-memory harness (`getTestInstance`, sign-up/verify helpers, email capture)

Integration tests run in a dedicated Vitest project with a 20s timeout (`vite.config.ts` → `integration` project). Multi-step Better Auth flows can exceed the default 5s limit when files run in parallel.

Global setup: `tests/setup/vitest.setup.ts`. Theme hooks are stubbed via `tests/mocks/wrksz-themes.ts` (Vitest aliases both `@wrksz/themes/client` and `@wrksz/themes/next` to that file).

Component tests use `/** @vitest-environment jsdom */` as the first line of the file. Vitest globals (`describe`, `it`, `expect`, `vi`) are enabled—no per-file imports needed. Suite blocks use `describe(fnUnderTest, …)` to match project lint/format conventions.
