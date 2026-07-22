import type { JSX } from "react"

import { TECH_STACK } from "~/src/app/[locale]/(landing)/_lib/tech-stack"

const MARQUEE_DUPLICATES = ["first", "second"] as const

export function TechSection(): JSX.Element {
  return (
    <section className="relative z-10 flex overflow-hidden border-y border-border/50 bg-background/50 py-8 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-linear-to-l from-background to-transparent" />

      <div className="flex w-max animate-marquee items-center opacity-50 grayscale transition-all duration-700 hover:grayscale-0">
        {MARQUEE_DUPLICATES.map((set) => (
          <div key={set} className="flex items-center gap-16 pr-16 md:gap-24 md:pr-24">
            {TECH_STACK.map((stack) => {
              const { Icon } = stack
              return (
                <span
                  key={`${set}-${stack.name}`}
                  className="flex items-center gap-2 text-xl font-medium tracking-tight whitespace-nowrap text-foreground"
                >
                  <Icon className="size-6" />
                  {stack.name}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
