import type { JSX } from "react"

export function AuthSeparator({ label }: Readonly<{ label: string }>): JSX.Element {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground/50 uppercase">
      <div className="flex-1 border-t border-border/60" />
      <span className="font-normal">{label}</span>
      <div className="flex-1 border-t border-border/60" />
    </div>
  )
}
