export {
  forbidden,
  notFound,
  permanentRedirect,
  redirect,
  RedirectType,
  unauthorized,
} from "~/src/integrations/next-intl/__test__/mocks/navigation-control-flow"

const NAVIGATION_BASE_URL = "http://test.local"

let pathname = "/"
let searchParams = new URLSearchParams()
let params: Record<string, string | string[]> = {}

const pushMock = vi.fn<(href: string) => void>()
const replaceMock = vi.fn<(href: string) => void>()

function applyHref(href: string): void {
  const url = new URL(href, NAVIGATION_BASE_URL)
  pathname = url.pathname
  searchParams = new URLSearchParams(url.search)
}

pushMock.mockImplementation((href: string) => {
  applyHref(href)
})

replaceMock.mockImplementation((href: string) => {
  applyHref(href)
})

export function resetNextNavigationMock(options?: {
  params?: Record<string, string | string[]>
  pathname?: string
  searchParams?: URLSearchParams
}): void {
  pathname = options?.pathname ?? "/"
  searchParams = options?.searchParams ?? new URLSearchParams()
  params = options?.params ?? {}
  pushMock.mockClear()
  replaceMock.mockClear()
}

export function usePathname(): string {
  return pathname
}

export function useRouter() {
  return {
    back: vi.fn<() => void>(),
    forward: vi.fn<() => void>(),
    prefetch: vi.fn<(href: string) => void>(),
    push: pushMock,
    refresh: vi.fn<() => void>(),
    replace: replaceMock,
  }
}

export function useSearchParams(): URLSearchParams {
  return searchParams
}

export function useParams(): Record<string, string | string[]> {
  return params
}
