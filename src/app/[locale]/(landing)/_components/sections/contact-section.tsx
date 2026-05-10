import type { JSX } from "react"

import { Code2, Mail, MapPin } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/components/shadcn/button"
import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"
import { Textarea } from "~/src/components/shadcn/textarea"

export async function ContactSection(): Promise<JSX.Element> {
  const t = await getTranslations("landingPage.contact")

  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-background/50 p-2 shadow-2xl md:p-3">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          <div className="relative z-10 grid overflow-hidden rounded-[2rem] border border-border/50 bg-background/90 backdrop-blur-2xl lg:grid-cols-2">
            <div className="relative flex flex-col justify-between overflow-hidden bg-linear-to-br from-muted/50 to-transparent p-10 lg:p-14">
              <div className="relative z-10">
                <h2 className="mb-4 font-medium text-3xl text-foreground tracking-tight md:text-4xl">{t("title")}</h2>
                <p className="mb-12 max-w-sm text-muted-foreground text-sm leading-relaxed">{t("description")}</p>

                <div className="space-y-6">
                  <div className="flex w-fit cursor-pointer items-center gap-4 text-muted-foreground text-sm transition-colors hover:text-foreground">
                    <div className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background shadow-inner">
                      <Mail className="size-5 text-foreground" />
                    </div>
                    {CONSTANTS.CONTACT_EMAIL}
                  </div>
                  <div className="flex w-fit cursor-pointer items-center gap-4 text-muted-foreground text-sm transition-colors hover:text-foreground">
                    <div className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background shadow-inner">
                      <MapPin className="size-5 text-foreground" />
                    </div>
                    {t("location")}
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-16 flex gap-4">
                <Link
                  href={CONSTANTS.APP_GITHUB_URL}
                  className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground"
                >
                  <Code2 className="size-5" />
                </Link>
              </div>
            </div>

            <div className="bg-muted/30 p-10 lg:p-14">
              <form className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-muted-foreground">
                    {t("form.firstName")}
                  </Label>
                  <Input
                    id="firstName"
                    className="h-11 w-full rounded-xl border border-white/10 bg-transparent px-4 text-foreground text-sm shadow-inner transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress" className="text-muted-foreground">
                    {t("form.email")}
                  </Label>
                  <Input
                    type="email"
                    id="emailAddress"
                    className="h-11 w-full rounded-xl border border-white/10 bg-transparent px-4 text-foreground text-sm shadow-inner transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-muted-foreground">
                    {t("form.message")}
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-transparent p-4 text-foreground text-sm shadow-inner transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>

                <Button
                  type="button"
                  className="mt-4 h-12 w-full rounded-xl bg-linear-to-b from-primary to-primary/80 text-primary-foreground text-sm shadow-[0_0_30px_-5px_var(--color-primary)] transition-all hover:opacity-90"
                >
                  {t("form.button")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
