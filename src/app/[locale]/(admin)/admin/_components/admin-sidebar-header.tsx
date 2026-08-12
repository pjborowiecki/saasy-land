"use client"

import type { JSX } from "react"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { SidebarHeader } from "~/src/presentation/components/shadcn/sidebar"

import { Wordmark } from "~/src/presentation/components/custom/wordmark"

/**
 * The same mark the marketing site uses, at the same size, in the same place. An admin that
 * introduces its own logo treatment reads as a different product, and this one is the product.
 *
 * `h-14`, matched to the content header across the divide, so the two chrome bars form one
 * unbroken line across the top of the console.
 */
export function AdminSidebarHeader(): JSX.Element {
  return (
    <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-3 py-0">
      <Link
        className="flex h-9 items-center rounded-md px-2 transition-colors duration-200 ease-exp hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        href="/admin"
      >
        <Wordmark />
      </Link>
    </SidebarHeader>
  )
}
