import type { JSX, ReactNode } from "react"

interface LegalDocumentProps {
  readonly children: ReactNode
  readonly description: string
  readonly lastUpdated: string
  readonly title: string
}

export function LegalDocument({ children, description, lastUpdated, title }: Readonly<LegalDocumentProps>): JSX.Element {
  return (
    <div className="container mx-auto max-w-3xl px-6 py-16 md:py-24">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{lastUpdated}</p>
        <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl" data-testid="legal-document-title">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <div className="mt-12 flex flex-col gap-10">{children}</div>
    </div>
  )
}

interface LegalSectionProps {
  readonly body: string
  readonly title: string
}

export function LegalSection({ body, title }: Readonly<LegalSectionProps>): JSX.Element {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-medium text-foreground">{title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </section>
  )
}
