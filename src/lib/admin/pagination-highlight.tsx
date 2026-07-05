import type { ReactNode } from "react"

export function paginationHighlight(chunks: ReactNode): ReactNode {
  return <span className="text-foreground">{chunks}</span>
}
