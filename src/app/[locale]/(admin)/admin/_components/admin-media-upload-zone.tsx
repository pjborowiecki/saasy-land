import type { JSX } from "react"

import { CloudUpload } from "lucide-react"

interface AdminMediaUploadZoneProps {
  readonly helpText: string
  readonly uploadText: string
}

export function AdminMediaUploadZone({ helpText, uploadText }: AdminMediaUploadZoneProps): JSX.Element {
  return (
    <div className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/40 bg-secondary/10 p-8 text-center transition-colors hover:border-border/80">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-border/40 bg-secondary/30 transition-transform group-hover:scale-105">
        <CloudUpload className="size-6 text-muted-foreground transition-colors group-hover:text-foreground" />
      </div>
      <p className="mb-1 text-sm font-medium text-foreground">{uploadText}</p>
      <p className="text-xs text-muted-foreground">{helpText}</p>
    </div>
  )
}
