import type { JSX } from "react"

export function AuthSeparator({ label }: Readonly<{ label: string }>): JSX.Element {
  return (
    <div className="flex items-center gap-2 text-muted-foreground/50 text-xs uppercase">
      <div className="flex-1 border-border/60 border-t" />
      <span className="font-normal">{label}</span>
      <div className="flex-1 border-border/60 border-t" />
    </div>
  )
}
