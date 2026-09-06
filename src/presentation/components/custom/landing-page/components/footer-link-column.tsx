import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/lib/cn"

interface FooterLinkColumnProps extends ComponentProps<"ul"> {
  readonly heading: string
}

export const FooterLinkColumn = ({ children, className, heading, ...props }: Readonly<FooterLinkColumnProps>): JSX.Element => (
  <div>
    <h3 className="font-mono text-label text-muted-foreground uppercase">{heading}</h3>
    <ul className={cn("mt-4", className)} {...props}>
      {children}
    </ul>
  </div>
)
