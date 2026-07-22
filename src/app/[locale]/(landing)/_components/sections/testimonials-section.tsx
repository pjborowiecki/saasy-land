import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { cn } from "~/src/presentation/utils"

import { Avatar, AvatarFallback } from "~/src/presentation/components/shadcn/avatar"
import { Card, CardContent, CardHeader } from "~/src/presentation/components/shadcn/card"

import { TESTIMONIALS, type Testimonial } from "~/src/app/[locale]/(landing)/_lib/testimonials"

function TestimonialAuthor({ item }: { item: Testimonial }): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-12 border-border/50">
        <AvatarFallback className={cn("bg-linear-to-tr font-medium text-foreground", item.avatarColor)}>{item.initials}</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-sm font-medium text-foreground">{item.name}</div>
        <div className="text-xs text-muted-foreground">{item.role}</div>
      </div>
    </div>
  )
}

function TestimonialCard({ item }: { item: Testimonial }): JSX.Element {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/10">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="relative z-10 pb-4">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{item.title}</h3>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="mb-8 text-base leading-relaxed text-muted-foreground">{item.text}</p>
        <TestimonialAuthor item={item} />
      </CardContent>
    </Card>
  )
}

export async function TestimonialsSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.testimonials")

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
      <h2 className="mb-20 text-center text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        {t("titlePart1")}
        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t("titlePart2")}</span>
      </h2>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((col) => (
          <div key={col.colClass} className={cn("flex flex-col gap-6", col.colClass)}>
            {col.items.map((item) => (
              <TestimonialCard key={item.name} item={item} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
