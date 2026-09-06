import type { JSX } from "react"

/** Two hairlines and a word. Sentence case: uppercase would make a micro-label of a conjunction. */
export const AuthSeparator = ({ label }: Readonly<{ label: string }>): JSX.Element => (
  <div className="flex items-center gap-4">
    <span aria-hidden className="h-px flex-1 bg-border" />
    <span className="text-body-sm text-muted-foreground">{label}</span>
    <span aria-hidden className="h-px flex-1 bg-border" />
  </div>
)
