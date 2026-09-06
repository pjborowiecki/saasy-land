import { type ReactNode } from "react"

import { QueryClient } from "@tanstack/react-query"
import { act, renderHook } from "@testing-library/react"
import { expect, it, vi } from "vite-plus/test"

import { TestProviders, createTestRouter } from "~/src/platform/testing/lib/render"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

import { usePostAuthRedirect } from "~/src/hooks/use-post-auth-redirect"

vi.mock(import("~/src/integrations/better-auth/auth.session"), async (importOriginal) => ({
  ...(await importOriginal()),
  getCurrentSession: vi.fn<typeof getCurrentSession>(),
}))

it.each([
  ["customer", "/app"],
  ["admin", "/admin"],
] as const)("redirects %s after authentication", async (role, to) => {
  vi.mocked(getCurrentSession).mockResolvedValue(createAuthSessionFixture({ role }))
  const router = createTestRouter()
  const navigate = vi.spyOn(router, "navigate").mockResolvedValue()
  const queryClient = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders router={router} queryClient={queryClient}>
      {children}
    </TestProviders>
  )
  const { result } = renderHook(() => usePostAuthRedirect(), { wrapper })
  await act(() => result.current())
  expect(navigate).toHaveBeenCalledWith({ to })
})
