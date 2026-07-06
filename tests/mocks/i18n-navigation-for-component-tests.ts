import { createElement, forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react"

import type * as I18nNavigation from "~/src/integrations/next-intl/i18n.navigation"

import { permanentRedirect, redirect } from "~/tests/mocks/navigation-control-flow"

type I18nRouter = ReturnType<typeof I18nNavigation.useRouter>

type NavigationLinkProps = ComponentPropsWithoutRef<"a"> & {
  children?: ReactNode
}

export function createNavigationLinkMock(): typeof I18nNavigation.Link {
  return forwardRef<HTMLAnchorElement, NavigationLinkProps>(function NavigationLinkMock(
    { children, href, ...rest },
    ref,
  ) {
    const linkHref = typeof href === "string" ? href : "/"

    return createElement("a", { href: linkHref, ref, ...rest }, children)
  }) as typeof I18nNavigation.Link
}

function createGetPathnameMock(): typeof I18nNavigation.getPathname {
  return ({ href }) => (typeof href === "string" ? href : "/")
}

export function createI18nNavigationPartialMock(
  createRouter: () => I18nRouter,
): Partial<typeof I18nNavigation> {
  const getPathname = createGetPathnameMock()

  return {
    Link: createNavigationLinkMock(),
    getPathname,
    permanentRedirect: (args, ...rest) => permanentRedirect(getPathname(args), ...rest),
    redirect: (args, ...rest) => redirect(getPathname(args), ...rest),
    usePathname: () => "/docs",
    useRouter: createRouter,
  }
}
