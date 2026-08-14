export const MOCK_UUID_V7 = "00000000-0000-7000-8000-000000000001"

/**
 * A fixed identifier, so a row a use case inserts is assertable.
 *
 * Aliased over the real `uuidv7` package in `vite.config.ts`. It used to stand in for Bun's
 * `randomUUIDv7`, back when the app imported the `bun` builtin directly — which tied `next build`
 * to the Bun runtime, and Bun 1.3.14 (the only version npm or Vercel can provide) dies with
 * SIGILL at the end of the build on Vercel's x64 builders.
 */
export function uuidv7(): string {
  return MOCK_UUID_V7
}
