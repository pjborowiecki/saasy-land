import type { JSX } from "react"

export const AuthSeparator = ({ label }: Readonly<{ label: string }>): JSX.Element => (
  <div className="flex items-center gap-4">
    <span aria-hidden className="h-px flex-1 bg-border" />
    <span className="text-body-sm text-muted-foreground">{label}</span>
    <span aria-hidden className="h-px flex-1 bg-border" />
  </div>
)
