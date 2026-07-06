import type { JSX, ReactNode } from "react"

import { Code2, Mail, MapPin, type LucideIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/components/shadcn/button"
import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"
import { Textarea } from "~/src/components/shadcn/textarea"

const FORM_INPUT_CLASS =
  "h-11 w-full rounded-xl border border-white/10 bg-transparent px-4 text-sm text-foreground shadow-inner transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:outline-none"

const FORM_TEXTAREA_CLASS =
  "w-full resize-none rounded-xl border border-white/10 bg-transparent p-4 text-sm text-foreground shadow-inner transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:outline-none"

function ContactDetailItem({ children, icon: Icon }: { children: ReactNode; icon: LucideIcon }): JSX.Element {
  return (
    <div className="flex w-fit cursor-pointer items-center gap-4 text-sm text-muted-foreground transition-colors hover:text-foreground">
      <div className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background shadow-inner">
        <Icon className="size-5 text-foreground" />
      </div>
      {children}
    </div>
  )
}

function ContactField({ children, htmlFor, label }: { children: ReactNode; htmlFor: string; label: string }): JSX.Element {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground" htmlFor={htmlFor}>
        {label}
      </Label>
      {children}
    </div>
  )
}

function ContactSidebar({ description, location, title }: { description: string; location: string; title: string }): JSX.Element {
  return (
    <>
      <div className="relative z-10">
        <h2 className="mb-4 text-3xl font-medium tracking-tight text-foreground md:text-4xl">{title}</h2>
        <p className="mb-12 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>

        <div className="space-y-6">
          <ContactDetailItem icon={Mail}>{CONSTANTS.CONTACT_EMAIL}</ContactDetailItem>
          <ContactDetailItem icon={MapPin}>{location}</ContactDetailItem>
        </div>
      </div>

      <div className="relative z-10 mt-16 flex gap-4">
        <Link
          className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground"
          href={CONSTANTS.APP_GITHUB_URL}
        >
          <Code2 className="size-5" />
        </Link>
      </div>
    </>
  )
}

function ContactForm({
  emailLabel,
  firstNameLabel,
  messageLabel,
  submitLabel,
}: {
  emailLabel: string
  firstNameLabel: string
  messageLabel: string
  submitLabel: string
}): JSX.Element {
  return (
    <form className="space-y-8">
      <ContactField htmlFor="firstName" label={firstNameLabel}>
        <Input className={FORM_INPUT_CLASS} id="firstName" />
      </ContactField>

      <ContactField htmlFor="emailAddress" label={emailLabel}>
        <Input className={FORM_INPUT_CLASS} id="emailAddress" type="email" />
      </ContactField>

      <ContactField htmlFor="message" label={messageLabel}>
        <Textarea className={FORM_TEXTAREA_CLASS} id="message" rows={4} />
      </ContactField>

      <Button
        className="mt-4 h-12 w-full rounded-xl bg-linear-to-b from-primary to-primary/80 text-sm text-primary-foreground shadow-[0_0_30px_-5px_var(--color-primary)] transition-all hover:opacity-90"
        type="button"
      >
        {submitLabel}
      </Button>
    </form>
  )
}

export async function ContactSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.contact")

  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-background/50 p-2 shadow-2xl md:p-3">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          <div className="relative z-10 grid overflow-hidden rounded-[2rem] border border-border/50 bg-background/90 backdrop-blur-2xl lg:grid-cols-2">
            <div className="relative flex flex-col justify-between overflow-hidden bg-linear-to-br from-muted/50 to-transparent p-10 lg:p-14">
              <ContactSidebar description={t("description")} location={t("location")} title={t("title")} />
            </div>

            <div className="bg-muted/30 p-10 lg:p-14">
              <ContactForm
                emailLabel={t("form.email")}
                firstNameLabel={t("form.firstName")}
                messageLabel={t("form.message")}
                submitLabel={t("form.button")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
