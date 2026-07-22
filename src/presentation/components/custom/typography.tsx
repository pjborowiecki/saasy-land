import type { ComponentPropsWithoutRef, HTMLAttributes, JSX, ReactNode } from "react"

import { cn } from "~/src/presentation/utils"

type ElProps<T extends keyof JSX.IntrinsicElements> = Readonly<ComponentPropsWithoutRef<T>>
type HeadingProps<T extends "h1" | "h2" | "h3" | "h4"> = Readonly<Omit<ComponentPropsWithoutRef<T>, "children"> & { children: ReactNode }>

export function H1({ className, children, ...props }: HeadingProps<"h1">): JSX.Element {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight text-balance", className)} {...props}>
      {children}
    </h1>
  )
}

export function H2({ className, children, ...props }: HeadingProps<"h2">): JSX.Element {
  return (
    <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)} {...props}>
      {children}
    </h2>
  )
}

export function H3({ className, children, ...props }: HeadingProps<"h3">): JSX.Element {
  return (
    <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props}>
      {children}
    </h3>
  )
}

export function H4({ className, children, ...props }: HeadingProps<"h4">): JSX.Element {
  return (
    <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}>
      {children}
    </h4>
  )
}

export function P({ className, ...props }: ElProps<"p">): JSX.Element {
  return <p className={cn("leading-7 not-first:mt-6", className)} {...props} />
}

export function Lead({ className, ...props }: ElProps<"p">): JSX.Element {
  return <p className={cn("text-xl text-muted-foreground", className)} {...props} />
}

export function Large({ className, ...props }: ElProps<"div">): JSX.Element {
  return <div className={cn("text-lg font-semibold", className)} {...props} />
}

export function Small({ className, ...props }: ElProps<"small">): JSX.Element {
  return <small className={cn("text-sm leading-none font-medium", className)} {...props} />
}

export function Muted({ className, ...props }: ElProps<"p">): JSX.Element {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export function Blockquote({ className, ...props }: ElProps<"blockquote">): JSX.Element {
  return <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />
}

export function InlineCode({ className, ...props }: ElProps<"code">): JSX.Element {
  return <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)} {...props} />
}

export function List({ className, ...props }: ElProps<"ul">): JSX.Element {
  return <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
}

export function TableWrap({ className, ...props }: ElProps<"div">): JSX.Element {
  return <div className={cn("my-6 w-full overflow-x-auto", className)} {...props} />
}

export function Prose({ className, ...props }: Readonly<HTMLAttributes<HTMLElement>>): JSX.Element {
  return <article className={cn("typeset typeset-docs max-w-none [&_:is(h1,h2,h3,h4,h5,h6)]:scroll-mt-24", className)} {...props} />
}
