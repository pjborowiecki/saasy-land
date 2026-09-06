import type { JSX, ReactNode } from "react"

/**
 * Every auth page is the same column: a heading, one line of sub-copy, the work, then the way
 * onward. No card. The split already frames the form, and a floating panel inside a framed
 * column is a second bezel.
 *
 * The heading breathes upward into the column padding and sits tight to its
 * sub-copy (`mt-4`); the work is pushed clear of both (`mt-10`) so the eye reads
 * heading, then task, and never treats the two as one block.
 */
interface AuthPageShellProps {
  readonly children: ReactNode
  readonly description: string
  readonly footer?: ReactNode
  readonly title: string
}

export const AuthPageShell = ({ children, description, footer, title }: Readonly<AuthPageShellProps>): JSX.Element => (
  <div className="flex w-full max-w-105 flex-col">
    <h1 className="text-headline-support text-balance text-foreground">{title}</h1>
    <p className="mt-3 text-body text-pretty text-muted-foreground">{description}</p>

    <div className="mt-10 flex flex-col gap-6">{children}</div>

    {footer === undefined ? undefined : <div className="mt-10 text-body-sm text-muted-foreground">{footer}</div>}
  </div>
)
