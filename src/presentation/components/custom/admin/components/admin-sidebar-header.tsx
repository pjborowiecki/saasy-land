import type { JSX } from "react"

import { Link } from "@tanstack/react-router"

import { SidebarHeader } from "~/src/presentation/components/shadcn/sidebar"

import { Wordmark } from "~/src/presentation/components/custom/wordmark"

export const AdminSidebarHeader = (): JSX.Element => (
  <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-3 py-0">
    <Link
      className="flex h-9 items-center rounded-md px-2 transition-colors duration-200 ease-exp hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      to="/admin"
    >
      <Wordmark />
    </Link>
  </SidebarHeader>
)
