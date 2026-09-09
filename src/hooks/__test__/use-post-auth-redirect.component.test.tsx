import { type ReactNode } from "react"

import { QueryClient } from "@tanstack/react-query"
import { act, renderHook } from "@testing-library/react"
import { expect, it, vi } from "vite-plus/test"

import { TestProviders, createTestRouter } from "~/src/platform/testing/lib/render"

import { LICENSE_QUERY_KEYS } from "~/src/modules/license/license.constants"

import { usePostAuthRedirect } from "~/src/hooks/use-post-auth-redirect"

it("uses the guarded callback after authentication and replaces the auth history entry", async () => {
  const router = createTestRouter()
  const navigate = vi.spyOn(router, "navigate").mockResolvedValue()
  const clearCache = vi.spyOn(router, "clearCache")
  const queryClient = new QueryClient()
  queryClient.setQueryData(LICENSE_QUERY_KEYS.CURRENT, { key: "previous-license" })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders router={router} queryClient={queryClient}>
      {children}
    </TestProviders>
  )
  const { result } = renderHook(() => usePostAuthRedirect(), { wrapper })
  await act(() => result.current())
  expect(queryClient.getQueryData(LICENSE_QUERY_KEYS.CURRENT)).toBeUndefined()
  expect(clearCache).toHaveBeenCalledOnce()
  expect(navigate).toHaveBeenCalledWith({ replace: true, to: "/auth/callback" })
})
