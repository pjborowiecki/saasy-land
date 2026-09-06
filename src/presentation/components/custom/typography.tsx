import type { ComponentPropsWithoutRef, HTMLAttributes, JSX, ReactNode } from "react"

import { cn } from "~/src/lib/cn"

type ElProps<TValue extends keyof JSX.IntrinsicElements> = Readonly<ComponentPropsWithoutRef<TValue>>
type HeadingProps<TValue extends "h1" | "h2" | "h3" | "h4"> = Readonly<
  Omit<ComponentPropsWithoutRef<TValue>, "children"> & { children: ReactNode }
>

export const H1 = ({ className, children, ...props }: HeadingProps<"h1">): JSX.Element => (
  <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight text-balance", className)} {...props}>
    {children}
  </h1>
)

export const H2 = ({ className, children, ...props }: HeadingProps<"h2">): JSX.Element => (
  <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)} {...props}>
    {children}
  </h2>
)

export const H3 = ({ className, children, ...props }: HeadingProps<"h3">): JSX.Element => (
  <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props}>
    {children}
  </h3>
)

export const H4 = ({ className, children, ...props }: HeadingProps<"h4">): JSX.Element => (
  <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}>
    {children}
  </h4>
)

export const Paragraph = ({ className, ...props }: ElProps<"p">): JSX.Element => (
  <p className={cn("leading-7 not-first:mt-6", className)} {...props} />
)

export const Lead = ({ className, ...props }: ElProps<"p">): JSX.Element => (
  <p className={cn("text-xl text-muted-foreground", className)} {...props} />
)

export const Large = ({ className, ...props }: ElProps<"div">): JSX.Element => (
  <div className={cn("text-lg font-semibold", className)} {...props} />
)

export const Small = ({ className, ...props }: ElProps<"small">): JSX.Element => (
  <small className={cn("text-sm leading-none font-medium", className)} {...props} />
)

export const Muted = ({ className, ...props }: ElProps<"p">): JSX.Element => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)

export const Blockquote = ({ className, ...props }: ElProps<"blockquote">): JSX.Element => (
  <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />
)

export const InlineCode = ({ className, ...props }: ElProps<"code">): JSX.Element => (
  <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)} {...props} />
)

export const List = ({ className, ...props }: ElProps<"ul">): JSX.Element => (
  <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
)

export const TableWrap = ({ className, ...props }: ElProps<"div">): JSX.Element => (
  <div className={cn("my-6 w-full overflow-x-auto", className)} {...props} />
)

export const Prose = ({ className, ...props }: Readonly<HTMLAttributes<HTMLElement>>): JSX.Element => (
  <article className={cn("typeset typeset-docs max-w-none [&_:is(h1,h2,h3,h4,h5,h6)]:scroll-mt-24", className)} {...props} />
)
