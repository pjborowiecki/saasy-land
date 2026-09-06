import type { JSX } from "react"

import { Link } from "@tanstack/react-router"

interface UnsubscribeConfirmationProps {
  readonly body: string
  readonly note: string
  readonly resubscribe: string
  readonly title: string
}

export const UnsubscribeConfirmation = ({ body, note, resubscribe, title }: UnsubscribeConfirmationProps): JSX.Element => (
  <section className="relative">
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-32 text-center md:py-40">
      <h1 className="text-headline-peak text-balance text-foreground">{title}</h1>
      <p className="mt-5 text-lead text-pretty text-muted-foreground">{body}</p>
      <p className="mt-8 text-body-sm text-pretty text-muted-foreground">{note}</p>
      <Link
        className="mt-10 rounded-sm text-body-sm font-medium text-foreground underline underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        to="/"
      >
        {resubscribe}
      </Link>
    </div>
  </section>
)
