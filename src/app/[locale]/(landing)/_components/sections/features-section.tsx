import type { JSX } from "react"

import { BookOpen, Database, Globe, LayoutTemplate, Lock, Mail, Medal, Search, ShieldCheck, Triangle, Wallet, Zap } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Card, CardDescription, CardHeader, CardTitle } from "~/src/components/shadcn/card"

export async function FeaturesSection(): Promise<JSX.Element> {
  const t = await getTranslations("landingPage.features")

  const features = [
    {
      id: "auth",
      Icon: Lock,
    },
    {
      id: "db",
      Icon: Database,
    },
    {
      id: "stripe",
      Icon: Wallet,
    },
    {
      id: "email",
      Icon: Mail,
    },
    {
      id: "seo",
      Icon: Search,
    },
    {
      id: "ui",
      Icon: LayoutTemplate,
    },
    {
      id: "i18n",
      Icon: Globe,
    },
    {
      id: "typeSafety",
      Icon: ShieldCheck,
    },
    {
      id: "quality",
      Icon: Medal,
    },
    {
      id: "performance",
      Icon: Zap,
    },
    {
      id: "vercel",
      Icon: Triangle,
    },
    {
      id: "blog",
      Icon: BookOpen,
    },
  ]

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <h2 className="mb-6 font-medium text-4xl text-foreground tracking-tight md:text-5xl">
          {t("titlePart1")}
          <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t("titlePart2")}</span>
        </h2>
        <p className="font-normal text-lg text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const { id, Icon } = feature
          return (
            <Card
              key={id}
              className="group relative overflow-hidden border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/10"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Giant translucent icon in the background */}
              <div className="absolute -top-8 -right-8 z-0 opacity-[0.03] transition-transform duration-700 ease-out group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-[0.05]">
                <Icon className="h-48 w-48" />
              </div>

              <CardHeader className="relative z-10 flex flex-col items-start">
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-inner transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/20">
                  <Icon className="size-6 text-primary" />
                </div>
                <CardTitle className="mb-3 font-medium text-foreground text-xl tracking-tight">{t(`list.${id}.title`)}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">{t(`list.${id}.description`)}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
