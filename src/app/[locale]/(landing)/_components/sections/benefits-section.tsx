import Image from "next/image"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/components/shadcn/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/components/shadcn/card"

export async function BenefitsSection(): Promise<JSX.Element> {
  const t = await getTranslations("landingPage.benefits")

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="mb-24 text-center">
        <h2 className="font-medium text-4xl text-foreground tracking-tight md:text-5xl">
          {t("titlePart1")}
          <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t("titlePart2")}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl font-normal text-lg text-muted-foreground tracking-normal">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card className="group relative flex min-h-[500px] flex-col justify-between overflow-hidden border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/10">
            <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <CardHeader className="relative z-10 mb-8 flex flex-col items-start">
              <Badge variant="outline" className="mb-3 w-fit border-primary/20 bg-primary/5 text-primary uppercase tracking-widest">
                {t("cards.timeSaver.badge")}
              </Badge>
              <CardTitle className="mb-4 font-medium text-3xl text-foreground tracking-tight">{t("cards.timeSaver.title")}</CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                {t("cards.timeSaver.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 mt-auto px-6 pt-0 pb-6">
              <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-colors group-hover:border-border">
                <Image
                  src="/images/benefits/time-saver.webp"
                  alt="Time Saver Growth"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="group relative flex min-h-[500px] flex-col overflow-hidden border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader className="relative z-10 flex flex-col items-start">
              <Badge variant="outline" className="mb-3 w-fit border-pink-500/20 bg-pink-500/5 text-pink-500 uppercase tracking-widest">
                {t("cards.modernTech.badge")}
              </Badge>
              <CardTitle className="mb-4 font-medium text-3xl text-foreground tracking-tight">{t("cards.modernTech.title")}</CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                {t("cards.modernTech.description")}
              </CardDescription>
            </CardHeader>
            <div className="absolute -inset-x-10 -bottom-20 h-[400px] bg-linear-to-tr from-indigo-500/20 via-primary/20 to-pink-500/20 opacity-60 blur-[80px] transition-opacity duration-700 group-hover:opacity-100" />
            <CardContent className="relative z-10 mt-auto px-6 pt-0 pb-6">
              <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-colors group-hover:border-border">
                <Image
                  src="/images/benefits/modern-tech.webp"
                  alt="Modern Tech"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:pt-12">
          <Card className="group relative flex min-h-[450px] flex-col overflow-hidden border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader className="relative z-10 mb-8 flex flex-col items-start">
              <Badge
                variant="outline"
                className="mb-3 w-fit border-indigo-500/20 bg-indigo-500/5 text-indigo-500 uppercase tracking-widest"
              >
                {t("cards.quality.badge")}
              </Badge>
              <CardTitle className="mb-4 font-medium text-3xl text-foreground tracking-tight">{t("cards.quality.title")}</CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                {t("cards.quality.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 mt-auto px-6 pt-0 pb-6">
              <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-colors group-hover:border-border">
                <Image
                  src="/images/benefits/quality.webp"
                  alt="Quality Code"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="group relative flex min-h-[500px] flex-col overflow-hidden border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader className="relative z-10 mb-8 flex flex-col items-start">
              <Badge variant="outline" className="mb-3 w-fit border-rose-500/20 bg-rose-500/5 text-rose-500 uppercase tracking-widest">
                {t("cards.flexibility.badge")}
              </Badge>
              <CardTitle className="mb-4 font-medium text-3xl text-foreground tracking-tight">{t("cards.flexibility.title")}</CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                {t("cards.flexibility.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 mt-auto px-6 pt-0 pb-6">
              <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-colors group-hover:border-border">
                <Image
                  src="/images/benefits/flexibility.webp"
                  alt="Flexibility Shapes"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
