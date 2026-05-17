import type { Metadata } from "next"
import type { JSX } from "react"

import {
  Archive,
  Book,
  Bookmark,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code,
  Crown,
  Eye,
  EyeOff,
  Filter,
  Folder,
  FolderOpen,
  Layers,
  MoreHorizontal,
  PlusCircle,
  Puzzle,
  Search,
  Server,
  Shirt,
  Star,
  Users,
  Video,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"
import { Card } from "~/src/components/shadcn/card"
import { Checkbox } from "~/src/components/shadcn/checkbox"
import { Input } from "~/src/components/shadcn/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.products" })

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

export default async function ProductsPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.products" })

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 duration-500">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="mb-1 font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        {/* Tabs and Actions */}
        <div className="flex flex-col gap-4 border-border border-b sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
            <TabsTrigger value="all" className="flex-none px-0 text-sm">
              {t("tabs.all")}
            </TabsTrigger>
            <TabsTrigger value="onetime" className="flex-none px-0 text-sm">
              {t("tabs.onetime")}
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex-none px-0 text-sm">
              {t("tabs.subscriptions")}
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex-none px-0 text-sm">
              {t("tabs.categories")}
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex-none px-0 text-sm">
              {t("tabs.collections")}
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex-none px-0 text-sm">
              {t("tabs.drafts")}
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex-none px-0 text-sm">
              {t("tabs.courses")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-6 space-y-4 outline-none">
          {/* Filters & Search Bar */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                <Filter className="size-4 text-muted-foreground" />
                {t("filters.type")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                {t("filters.status")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="group relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input placeholder={t("search.placeholder")} className="h-10 w-full pl-10" />
            </div>

            <Link href="/admin/products/create" className="shrink-0">
              <Button size="sm" className="h-10 w-full gap-2 sm:w-auto">
                <PlusCircle className="size-4" />
                {t("actions.create")}
              </Button>
            </Link>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border/40 border-b bg-secondary/20">
                    <th className="w-12 p-4 text-center">
                      <Checkbox className="mx-auto" />
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.product")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.type")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.pricing")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.status")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.metrics")}</th>
                    <th className="w-12 p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(
                    t.raw("list") as {
                      id: string
                      name: string
                      description: string
                      type: string
                      price: string
                      billingCycle: string
                      status: string
                      statusColor: "emerald" | "amber" | "rose" | "neutral"
                      metrics: string
                      icon: "Video" | "Book" | "Shirt" | "Users"
                      iconColor: "default" | "fuchsia" | "emerald"
                    }[]
                  ).map((product) => {
                    const ProductIcon = {
                      Video,
                      Book,
                      Shirt,
                      Users,
                    }[product.icon]

                    return (
                      <tr key={product.id} className="group transition-colors hover:bg-secondary/20">
                        <td className="p-4 text-center">
                          <Checkbox className="mx-auto" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary/30 ${
                                product.iconColor === "fuchsia"
                                  ? "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <ProductIcon className="size-5" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground text-sm">{product.name}</div>
                              <div className="mt-0.5 text-muted-foreground text-xs">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="px-2 py-1 font-medium text-muted-foreground text-xs">
                            {product.type}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-foreground text-sm">
                            {product.price} <span className="font-normal text-muted-foreground">{product.billingCycle}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={`px-2 py-1 font-medium text-xs ${
                              product.statusColor === "emerald"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                : product.statusColor === "amber"
                                  ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                                  : product.statusColor === "rose"
                                    ? "border-rose-500/20 bg-rose-500/10 text-rose-500"
                                    : "border-border/50 bg-secondary/50 text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`mr-1.5 size-1.5 rounded-full ${
                                product.statusColor === "emerald"
                                  ? "bg-emerald-500"
                                  : product.statusColor === "amber"
                                    ? "bg-amber-500"
                                    : product.statusColor === "rose"
                                      ? "bg-rose-500"
                                      : "bg-muted-foreground"
                              }`}
                            />
                            {product.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm">{product.metrics}</td>
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
                {t.rich("pagination.info", {
                  start: 1,
                  end: 4,
                  total: 4,
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

        <TabsContent value="onetime" className="mt-6 space-y-4 outline-none">
          {/* Filters & Search Bar */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                <Filter className="size-4 text-muted-foreground" />
                {t("filters.type")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                {t("filters.status")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="group relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input placeholder={t("search.placeholder")} className="h-10 w-full pl-10" />
            </div>

            <Link href="/admin/products/create" className="shrink-0">
              <Button size="sm" className="h-10 w-full gap-2 sm:w-auto">
                <PlusCircle className="size-4" />
                {t("actions.create")}
              </Button>
            </Link>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border/40 border-b bg-secondary/20">
                    <th className="w-12 p-4 text-center">
                      <Checkbox className="mx-auto" />
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.product")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.type")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.pricing")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.status")}</th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("table.headers.metrics")}</th>
                    <th className="w-12 p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(
                    t.raw("onetime.list") as {
                      id: string
                      name: string
                      description: string
                      type: string
                      price: string
                      billingCycle: string
                      status: string
                      statusColor: "emerald" | "amber" | "rose" | "neutral"
                      metrics: string
                      icon: "Video" | "Book" | "Shirt" | "Users" | "Layers"
                      iconColor: "default" | "fuchsia" | "emerald"
                      tags?: { icon: "Folder" | "Bookmark"; text: string; color: "default" | "fuchsia" | "blue" | "emerald" }[]
                    }[]
                  ).map((product) => {
                    const ProductIcon = {
                      Video,
                      Book,
                      Shirt,
                      Users,
                      Layers,
                    }[product.icon]

                    return (
                      <tr key={product.id} className="group transition-colors hover:bg-secondary/20">
                        <td className="p-4 pt-5 align-top">
                          <Checkbox className="mx-auto" />
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex gap-3">
                            <div
                              className={`flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary/30 ${
                                product.iconColor === "fuchsia"
                                  ? "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <ProductIcon className="size-5" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground text-sm">{product.name}</div>
                              <div className="mt-0.5 text-muted-foreground text-xs">{product.description}</div>
                              {product.tags && product.tags.length > 0 && (
                                <div className="mt-2.5 flex items-center gap-1.5">
                                  {product.tags.map((tag) => {
                                    const TagIcon = tag.icon === "Folder" ? Folder : Bookmark
                                    return (
                                      <span
                                        key={tag.text}
                                        className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-medium text-[10px] ${
                                          tag.color === "fuchsia"
                                            ? "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-500"
                                            : tag.color === "blue"
                                              ? "border-blue-500/20 bg-blue-500/10 text-blue-500"
                                              : tag.color === "emerald"
                                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                                : "border-border/50 bg-secondary/50 text-muted-foreground"
                                        }`}
                                      >
                                        <TagIcon className="size-[10px] opacity-70" />
                                        {tag.text}
                                      </span>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 pt-5 align-top">
                          <Badge variant="outline" className="px-2 py-1 font-medium text-muted-foreground text-xs">
                            {product.type}
                          </Badge>
                        </td>
                        <td className="p-4 pt-5 align-top">
                          <div className="font-medium text-foreground text-sm">
                            {product.price} <span className="font-normal text-muted-foreground">{product.billingCycle}</span>
                          </div>
                        </td>
                        <td className="p-4 pt-5 align-top">
                          <Badge
                            variant="outline"
                            className={`px-2 py-1 font-medium text-xs ${
                              product.statusColor === "emerald"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                : product.statusColor === "amber"
                                  ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                                  : product.statusColor === "rose"
                                    ? "border-rose-500/20 bg-rose-500/10 text-rose-500"
                                    : "border-border/50 bg-secondary/50 text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`mr-1.5 size-1.5 rounded-full ${
                                product.statusColor === "emerald"
                                  ? "bg-emerald-500"
                                  : product.statusColor === "amber"
                                    ? "bg-amber-500"
                                    : product.statusColor === "rose"
                                      ? "bg-rose-500"
                                      : "bg-muted-foreground"
                              }`}
                            />
                            {product.status}
                          </Badge>
                        </td>
                        <td className="p-4 pt-5 align-top text-muted-foreground text-sm">{product.metrics}</td>
                        <td className="p-4 pt-4 text-right align-top">
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
                {t.rich("pagination.info", {
                  start: 1,
                  end: 3,
                  total: 3,
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

        <TabsContent value="subscriptions" className="mt-6 space-y-4 outline-none">
          {/* Filters & Search Bar */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                <Filter className="size-4 text-muted-foreground" />
                {t("filters.type")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                {t("filters.status")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="group relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input placeholder={t("search.placeholder")} className="h-10 w-full pl-10" />
            </div>

            <Link href="/admin/products/create" className="shrink-0">
              <Button size="sm" className="h-10 w-full gap-2 sm:w-auto">
                <PlusCircle className="size-4" />
                {t("actions.create")}
              </Button>
            </Link>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border/40 border-b bg-secondary/20">
                    <th className="w-12 p-4 text-center">
                      <Checkbox className="mx-auto" />
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("subscriptions.table.headers.product")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("subscriptions.table.headers.model")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("subscriptions.table.headers.pricing")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("subscriptions.table.headers.status")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("subscriptions.table.headers.metrics")}
                    </th>
                    <th className="w-12 p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(
                    t.raw("subscriptions.list") as {
                      id: string
                      name: string
                      description: string
                      type: string
                      price: string
                      billingCycle: string
                      status: string
                      statusColor: "emerald" | "amber" | "rose" | "neutral"
                      metrics: string
                      icon: "Crown" | "Users" | "Server"
                      iconColor: "default" | "fuchsia" | "emerald"
                      tags?: {
                        icon: "Folder" | "Building2" | "Code" | "Star"
                        text: string
                        color: "default" | "fuchsia" | "blue" | "emerald"
                      }[]
                    }[]
                  ).map((product) => {
                    const ProductIcon = {
                      Crown,
                      Users,
                      Server,
                    }[product.icon]

                    return (
                      <tr key={product.id} className="group transition-colors hover:bg-secondary/20">
                        <td className="p-4 pt-5 align-top">
                          <Checkbox className="mx-auto" />
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex gap-3">
                            <div
                              className={`flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary/30 ${
                                product.iconColor === "fuchsia"
                                  ? "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-500"
                                  : product.iconColor === "emerald"
                                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                    : "text-muted-foreground"
                              }`}
                            >
                              <ProductIcon className="size-5" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground text-sm">{product.name}</div>
                              <div className="mt-0.5 text-muted-foreground text-xs">{product.description}</div>
                              {product.tags && product.tags.length > 0 && (
                                <div className="mt-2.5 flex items-center gap-1.5">
                                  {product.tags.map((tag) => {
                                    const TagIcon = {
                                      Folder,
                                      Building2,
                                      Code,
                                      Star,
                                    }[tag.icon]
                                    return (
                                      <span
                                        key={tag.text}
                                        className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-medium text-[10px] ${
                                          tag.color === "fuchsia"
                                            ? "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-500"
                                            : tag.color === "blue"
                                              ? "border-blue-500/20 bg-blue-500/10 text-blue-500"
                                              : tag.color === "emerald"
                                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                                : "border-border/50 bg-secondary/50 text-muted-foreground"
                                        }`}
                                      >
                                        <TagIcon className="size-[10px] opacity-70" />
                                        {tag.text}
                                      </span>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 pt-5 align-top">
                          <Badge variant="outline" className="px-2 py-1 font-medium text-muted-foreground text-xs">
                            {product.type}
                          </Badge>
                        </td>
                        <td className="p-4 pt-5 align-top">
                          <div className="font-medium text-foreground text-sm">
                            {product.price} <span className="font-normal text-muted-foreground">{product.billingCycle}</span>
                          </div>
                        </td>
                        <td className="p-4 pt-5 align-top">
                          <Badge
                            variant="outline"
                            className={`px-2 py-1 font-medium text-xs ${
                              product.statusColor === "emerald"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                : product.statusColor === "amber"
                                  ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                                  : product.statusColor === "rose"
                                    ? "border-rose-500/20 bg-rose-500/10 text-rose-500"
                                    : "border-border/50 bg-secondary/50 text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`mr-1.5 size-1.5 rounded-full ${
                                product.statusColor === "emerald"
                                  ? "bg-emerald-500"
                                  : product.statusColor === "amber"
                                    ? "bg-amber-500"
                                    : product.statusColor === "rose"
                                      ? "bg-rose-500"
                                      : "bg-muted-foreground"
                              }`}
                            />
                            {product.status}
                          </Badge>
                        </td>
                        <td className="p-4 pt-5 align-top text-muted-foreground text-sm">{product.metrics}</td>
                        <td className="p-4 pt-4 text-right align-top">
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
                {t.rich("pagination.info", {
                  start: 1,
                  end: 3,
                  total: 3,
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

        <TabsContent value="categories" className="mt-6 space-y-4 outline-none">
          {/* Filters & Search Bar */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                <Filter className="size-4 text-muted-foreground" />
                {t("filters.status")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="group relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input placeholder={t("search.placeholder")} className="h-10 w-full pl-10" />
            </div>

            <Link href="/admin/products/create" className="shrink-0">
              <Button size="sm" className="h-10 w-full gap-2 sm:w-auto">
                <PlusCircle className="size-4" />
                {t("actions.create")}
              </Button>
            </Link>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border/40 border-b bg-secondary/20">
                    <th className="w-12 p-4 text-center">
                      <Checkbox className="mx-auto" />
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("categories.table.headers.category")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("categories.table.headers.visibility")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("categories.table.headers.items")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("categories.table.headers.lastUpdated")}
                    </th>
                    <th className="w-12 p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(
                    t.raw("categories.list") as {
                      id: string
                      name: string
                      description: string
                      visibility: string
                      visibilityStatus: "public" | "hidden"
                      items: string
                      lastUpdated: string
                      icon: "FolderOpen" | "Puzzle" | "Archive"
                    }[]
                  ).map((category) => {
                    const CategoryIcon = {
                      FolderOpen,
                      Puzzle,
                      Archive,
                    }[category.icon]

                    return (
                      <tr key={category.id} className="group transition-colors hover:bg-secondary/20">
                        <td className="p-4 pt-5 align-top">
                          <Checkbox className="mx-auto" />
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary/30 text-muted-foreground">
                              <CategoryIcon className="size-5" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground text-sm">{category.name}</div>
                              <div className="mt-0.5 text-muted-foreground text-xs">{category.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 pt-5 align-top">
                          <Badge
                            variant="outline"
                            className={`px-2 py-1 font-medium text-[10px] ${
                              category.visibilityStatus === "public"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                : "border-muted/50 bg-secondary/50 text-muted-foreground"
                            }`}
                          >
                            {category.visibilityStatus === "public" ? (
                              <Eye className="mr-1.5 size-3" />
                            ) : (
                              <EyeOff className="mr-1.5 size-3" />
                            )}
                            {category.visibility}
                          </Badge>
                        </td>
                        <td className="p-4 pt-5 align-top">
                          <div className="font-medium text-foreground text-sm">
                            {category.items} <span className="font-normal text-muted-foreground">{"products"}</span>
                          </div>
                        </td>
                        <td className="p-4 pt-5 align-top text-muted-foreground text-sm">{category.lastUpdated}</td>
                        <td className="p-4 pt-4 text-right align-top">
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
                {t.rich("pagination.info", {
                  start: 1,
                  end: 3,
                  total: 3,
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

        <TabsContent value="collections" className="mt-6 space-y-4 outline-none">
          {/* Filters & Search Bar */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                <Filter className="size-4 text-muted-foreground" />
                {t("filters.status")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="group relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input placeholder={t("search.placeholder")} className="h-10 w-full pl-10" />
            </div>

            <Link href="/admin/products/create" className="shrink-0">
              <Button size="sm" className="h-10 w-full gap-2 sm:w-auto">
                <PlusCircle className="size-4" />
                {t("actions.create")}
              </Button>
            </Link>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border/40 border-b bg-secondary/20">
                    <th className="w-12 p-4 text-center">
                      <Checkbox className="mx-auto" />
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("collections.table.headers.collection")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("collections.table.headers.visibility")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("collections.table.headers.items")}
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {t("collections.table.headers.lastUpdated")}
                    </th>
                    <th className="w-12 p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(
                    t.raw("collections.list") as {
                      id: string
                      name: string
                      description: string
                      visibility: string
                      visibilityStatus: "public" | "hidden"
                      items: string
                      lastUpdated: string
                      icon: "FolderOpen" | "Puzzle" | "Archive"
                    }[]
                  ).map((collection) => {
                    const CollectionIcon = {
                      FolderOpen,
                      Puzzle,
                      Archive,
                    }[collection.icon]

                    return (
                      <tr key={collection.id} className="group transition-colors hover:bg-secondary/20">
                        <td className="p-4 pt-5 align-top">
                          <Checkbox className="mx-auto" />
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary/30 text-muted-foreground">
                              <CollectionIcon className="size-5" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground text-sm">{collection.name}</div>
                              <div className="mt-0.5 text-muted-foreground text-xs">{collection.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 pt-5 align-top">
                          <Badge
                            variant="outline"
                            className={`px-2 py-1 font-medium text-[10px] ${
                              collection.visibilityStatus === "public"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                : "border-muted/50 bg-secondary/50 text-muted-foreground"
                            }`}
                          >
                            {collection.visibilityStatus === "public" ? (
                              <Eye className="mr-1.5 size-3" />
                            ) : (
                              <EyeOff className="mr-1.5 size-3" />
                            )}
                            {collection.visibility}
                          </Badge>
                        </td>
                        <td className="p-4 pt-5 align-top">
                          <div className="font-medium text-foreground text-sm">
                            {collection.items} <span className="font-normal text-muted-foreground">{"products"}</span>
                          </div>
                        </td>
                        <td className="p-4 pt-5 align-top text-muted-foreground text-sm">{collection.lastUpdated}</td>
                        <td className="p-4 pt-4 text-right align-top">
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
                {t.rich("pagination.info", {
                  start: 1,
                  end: 3,
                  total: 3,
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

        <TabsContent value="courses" className="mt-6 space-y-4 outline-none">
          {/* Filters & Search Bar */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                <Filter className="size-4 text-muted-foreground" />
                {t("filters.type")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                {t("filters.status")}
                <ChevronDown className="ml-1 size-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="group relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input placeholder={t("search.placeholder")} className="h-10 w-full pl-10" />
            </div>

            <Link href="/admin/products/create" className="shrink-0">
              <Button size="sm" className="h-10 w-full gap-2 sm:w-auto">
                <PlusCircle className="size-4" />
                {t("actions.create")}
              </Button>
            </Link>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">{"No courses found."}</div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
