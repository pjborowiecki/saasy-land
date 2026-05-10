import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { cn } from "~/src/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "~/src/components/shadcn/avatar"
import { Card, CardContent, CardHeader } from "~/src/components/shadcn/card"

import { TESTIMONIALS } from "~/src/data/testimonials"

export async function TestimonialsSection(): Promise<JSX.Element> {
  const t = await getTranslations("landingPage.testimonials")

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
      <h2 className="mb-20 text-center font-medium text-4xl text-foreground tracking-tight md:text-5xl">
        {t("titlePart1")}
        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t("titlePart2")}</span>
      </h2>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((col) => (
          <div key={col.colClass} className={cn("flex flex-col gap-6", col.colClass)}>
            {col.items.map((item) => (
              <Card
                key={item.name}
                className="group relative overflow-hidden border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Subtle hover gradient background */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative z-10 pb-4">
                  <h3 className="font-semibold text-foreground text-lg tracking-tight">{item.title}</h3>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="mb-8 text-base text-muted-foreground leading-relaxed">{item.text}</p>
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12 border-border/50">
                      <AvatarImage src={item.avatar} alt={item.name} />
                      <AvatarFallback className={cn("bg-linear-to-tr font-medium text-foreground", item.avatarColor)}>
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground text-sm">{item.name}</div>
                      <div className="text-muted-foreground text-xs">{item.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
