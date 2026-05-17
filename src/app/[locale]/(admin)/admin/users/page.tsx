import type { Metadata } from "next"
import Image from "next/image"
import type { JSX } from "react"

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code,
  Download,
  Eye,
  Filter,
  HelpCircle,
  Link,
  Mail,
  MoreHorizontal,
  Pen,
  PlusCircle,
  Search,
  Shield,
  UserPlus,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"
import { Card } from "~/src/components/shadcn/card"
import { Checkbox } from "~/src/components/shadcn/checkbox"
import { Input } from "~/src/components/shadcn/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.users" })

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

export default async function UsersPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.users" })

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 duration-500">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="mb-1 font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultValue="allUsers" className="w-full">
        {/* Tabs and Actions */}
        <div className="flex flex-col gap-4 border-border border-b sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
            <TabsTrigger value="allUsers" className="flex-none px-0 text-sm">
              {t("tabs.allUsers")}
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex-none px-0 text-sm">
              {t("tabs.invitations")}
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex-none px-0 text-sm">
              {t("tabs.roles")}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-none px-0 text-sm">
              {t("tabs.security")}
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-3 pb-3 sm:pb-0">
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Download className="size-4 text-muted-foreground" />
              {t("actions.export")}
            </Button>
            <Button size="sm" className="h-9 gap-2">
              <UserPlus className="size-4" />
              {t("actions.addUser")}
            </Button>
          </div>
        </div>

        <TabsContent value="allUsers" className="mt-6 space-y-8 outline-none">
          {/* Filters & Search Bar */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="group relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input placeholder={t("search.placeholder")} className="h-10 w-full pl-10" />
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                <Filter className="size-4 text-muted-foreground" />
                {t("filters.role")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                {t("filters.status")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <Card className="overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border/40 border-b bg-secondary/20">
                    <th className="w-12 p-4 text-center">
                      <Checkbox className="mx-auto" />
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.user")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.role")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.status")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("table.headers.lastActive")}
                    </th>
                    <th className="w-12 p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(
                    t.raw("list") as {
                      id: string
                      name: string
                      email: string
                      initials?: string
                      colors?: string
                      avatar?: string
                      isBanned?: boolean
                      role: string
                      status: string
                      statusColor: "emerald" | "amber" | "rose"
                      lastActive: string
                    }[]
                  ).map((user) => (
                    <tr key={user.id} className="group transition-colors hover:bg-secondary/20">
                      <td className="p-4 text-center">
                        <Checkbox className="mx-auto" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              width={36}
                              height={36}
                              className={`size-9 shrink-0 rounded-full border border-border/50 ${user.isBanned ? "opacity-60 grayscale" : ""}`}
                            />
                          ) : (
                            <div
                              className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr font-medium text-sm text-white ${user.colors}`}
                            >
                              {user.initials}
                            </div>
                          )}
                          <div>
                            <p className={`font-medium text-sm ${user.isBanned ? "text-muted-foreground" : "text-foreground"}`}>
                              {user.name}
                            </p>
                            <p className="text-muted-foreground text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{user.role}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`px-2 py-1 font-medium text-xs ${
                            user.statusColor === "emerald"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                              : user.statusColor === "amber"
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                                : "border-rose-500/20 bg-rose-500/10 text-rose-500"
                          }
                      `}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{user.lastActive}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground focus:opacity-100 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-border/40 border-t bg-secondary/10 px-4 py-3">
              <span className="font-medium text-muted-foreground text-xs">
                {t.rich("pagination.info", {
                  start: 1,
                  end: 5,
                  total: 24,
                  highlight: (chunks) => <span className="text-foreground">{chunks}</span>,
                })}
              </span>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8 opacity-50" disabled>
                  <ChevronLeft className="size-4" />
                </Button>
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "outline" : "ghost"}
                    size="sm"
                    className={`size-8 p-0 ${page !== 1 ? "text-muted-foreground hover:text-foreground" : ""}`}
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="mt-0 space-y-8 outline-none">
          {/* Page Title & Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mb-1 font-medium text-2xl text-foreground tracking-tight">{t("invitations.title")}</h1>
              <p className="text-muted-foreground text-sm">{t("invitations.description")}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Link className="size-4 text-muted-foreground" />
                {t("invitations.actions.copyLink")}
              </Button>
              <Button size="sm" className="h-9 gap-2">
                <Mail className="size-4" />
                {t("invitations.actions.sendInvite")}
              </Button>
            </div>
          </div>

          {/* Filters & Search Bar */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="group relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input placeholder={t("invitations.search.placeholder")} className="h-10 w-full pl-10" />
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                <Filter className="size-4 text-muted-foreground" />
                {t("invitations.filters.role")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                {t("invitations.filters.status")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Invitations Table */}
          <Card className="overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border/40 border-b bg-secondary/20">
                    <th className="w-12 p-4 text-center">
                      <Checkbox className="mx-auto" />
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("invitations.table.headers.email")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("invitations.table.headers.role")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("invitations.table.headers.status")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("invitations.table.headers.sentDate")}
                    </th>
                    <th className="w-12 p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(
                    t.raw("invitations.list") as {
                      id: string
                      email: string
                      invitedBy: string
                      role: string
                      status: string
                      statusColor: "emerald" | "amber" | "rose"
                      sentDate: string
                    }[]
                  ).map((invite) => (
                    <tr key={invite.id} className="group transition-colors hover:bg-secondary/20">
                      <td className="p-4 text-center">
                        <Checkbox className="mx-auto" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border/50 bg-secondary/30 text-muted-foreground">
                            <Mail className="size-4" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{invite.email}</p>
                            <p className="text-muted-foreground text-xs">
                              {/* biome-ignore lint/style/noJsxLiterals: user string */}
                              Invited by {invite.invitedBy}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{invite.role}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`px-2 py-1 font-medium text-xs ${
                            invite.statusColor === "emerald"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                              : invite.statusColor === "amber"
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                                : "border-rose-500/20 bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {invite.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{invite.sentDate}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground focus:opacity-100 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-border/40 border-t bg-secondary/10 px-4 py-3">
              <span className="font-medium text-muted-foreground text-xs">
                {t.rich("invitations.pagination.info", {
                  start: 1,
                  end: 5,
                  total: 12,
                  highlight: (chunks) => <span className="text-foreground">{chunks}</span>,
                })}
              </span>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8 opacity-50" disabled>
                  <ChevronLeft className="size-4" />
                </Button>
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "outline" : "ghost"}
                    size="sm"
                    className={`size-8 p-0 ${page !== 1 ? "text-muted-foreground hover:text-foreground" : ""}`}
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-0 space-y-8 outline-none">
          {/* Page Title & Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mb-1 font-medium text-2xl text-foreground tracking-tight">{t("roles.title")}</h1>
              <p className="text-muted-foreground text-sm">{t("roles.description")}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button size="sm" className="h-9 gap-2">
                <PlusCircle className="size-4" />
                {t("roles.actions.createRole")}
              </Button>
            </div>
          </div>

          {/* Filters & Search Bar */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="group relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input placeholder={t("roles.search.placeholder")} className="h-10 w-full pl-10" />
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                <Filter className="size-4 text-muted-foreground" />
                {t("roles.filters.type")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Roles Table */}
          <Card className="overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border/40 border-b bg-secondary/20">
                    <th className="w-12 p-4 text-center">
                      <Checkbox className="mx-auto" />
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("roles.table.headers.name")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("roles.table.headers.description")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("roles.table.headers.type")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("roles.table.headers.users")}
                    </th>
                    <th className="w-12 p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(
                    t.raw("roles.list") as {
                      id: string
                      name: string
                      description: string
                      type: string
                      typeColor: "default" | "fuchsia"
                      usersCount: string
                      icon: "Shield" | "Pen" | "HelpCircle" | "Eye" | "Code"
                      iconColor: "default" | "fuchsia"
                    }[]
                  ).map((role) => {
                    const RoleIcon = {
                      Shield,
                      Pen,
                      HelpCircle,
                      Eye,
                      Code,
                    }[role.icon]

                    return (
                      <tr key={role.id} className="group transition-colors hover:bg-secondary/20">
                        <td className="p-4 text-center">
                          <Checkbox className="mx-auto" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-9 shrink-0 items-center justify-center rounded-full border border-border/50 bg-secondary/30 ${
                                role.iconColor === "fuchsia" ? "text-fuchsia-500" : "text-muted-foreground"
                              }`}
                            >
                              <RoleIcon className="size-4" />
                            </div>
                            <span className="font-medium text-foreground text-sm">{role.name}</span>
                          </div>
                        </td>
                        <td className="max-w-sm truncate p-4 text-muted-foreground text-sm">{role.description}</td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={`px-2 py-1 font-medium text-xs ${
                              role.typeColor === "fuchsia"
                                ? "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-500"
                                : "border-border/50 bg-secondary/50 text-muted-foreground"
                            }`}
                          >
                            {role.type}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm">{role.usersCount}</td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground focus:opacity-100 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-border/40 border-t bg-secondary/10 px-4 py-3">
              <span className="font-medium text-muted-foreground text-xs">
                {t.rich("roles.pagination.info", {
                  start: 1,
                  end: 5,
                  total: 5,
                  highlight: (chunks) => <span className="text-foreground">{chunks}</span>,
                })}
              </span>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8 opacity-50" disabled>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="outline" size="sm" className="size-8 p-0">
                  {1}
                </Button>
                <Button variant="ghost" size="icon" className="size-8 opacity-50" disabled>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
