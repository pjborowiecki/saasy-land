import type { JSX, ReactNode } from "react"

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
