import type { JSX } from "react"

const CONSULTING_HREF = "mailto:hello@saasyland.com?subject=Architecture%20call"
export interface ConsultingProps {
  readonly body: string
  readonly cta: string
  readonly label: string
  readonly period: string
  readonly price: string
  readonly title: string
}

export const ConsultingBand = ({ body, cta, label, period, price, title }: ConsultingProps): JSX.Element => (
  <div className="grid gap-x-12 gap-y-7 rounded-xl border border-border bg-card p-7 md:grid-cols-[1fr_auto] md:items-center md:p-8">
    <div>
      <p className="font-mono text-label text-muted-foreground uppercase">{label}</p>
      <h3 className="mt-3 max-w-[26ch] text-title text-balance text-foreground">{title}</h3>
      <p className="mt-3 max-w-[64ch] text-body-sm text-pretty text-muted-foreground">{body}</p>
    </div>

    <div className="flex flex-col items-stretch gap-4">
      <p className="flex items-baseline gap-2 md:justify-end">
        <span className="text-price text-foreground tabular-nums">{price}</span>
        <span className="font-mono text-spec text-muted-foreground">{period}</span>
      </p>
      <a
        className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-body-sm font-semibold whitespace-nowrap text-foreground transition-[background-color,border-color,transform] duration-200 ease-exp hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"
        href={CONSULTING_HREF}
      >
        {cta}
      </a>
    </div>
  </div>
)
