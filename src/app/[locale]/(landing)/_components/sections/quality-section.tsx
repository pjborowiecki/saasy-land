import type { JSX } from "react"

import { ArrowRight, Check } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { ConceptLoop } from "~/src/app/[locale]/(landing)/_components/concept-loop"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/reveal"

const SPEC_KEYS = ["vitest", "playwright", "typescript"] as const

const TERMINAL_DELAY_MS = 120

/**
 * Real output from the repository being sold, quoted verbatim.
 *
 * Terminal text is code, not copy, so it is hardcoded English by design and never translated: a
 * localised test summary would be a fabricated one. The four coverage figures are what
 * `bun run test:coverage` prints, which is the whole point of showing them.
 */
const TERMINAL_LINES = [
  { kind: "command", text: "bun run test:coverage" },
  { kind: "output", text: "Test Files  140 passed (140)" },
  { kind: "output", text: "     Tests  1284 passed (1284)" },
  { kind: "blank", text: "" },
  { kind: "pass", text: "% Stmts     100" },
  { kind: "pass", text: "% Branch    100" },
  { kind: "pass", text: "% Funcs     100" },
  { kind: "pass", text: "% Lines     100" },
] as const

type TerminalLine = (typeof TERMINAL_LINES)[number]

/** One printed line. The prompt and the tick are `select-none`, so copying the block copies code. */
function TerminalRow({ line }: Readonly<{ line: TerminalLine }>): JSX.Element {
  if (line.kind === "command") {
    return (
      <div className="whitespace-pre">
        <span className="text-muted-foreground/50 select-none">$ </span>
        <span className="text-foreground">{line.text}</span>
      </div>
    )
  }

  if (line.kind === "pass") {
    return (
      <div className="whitespace-pre">
        <span className="text-ring select-none">{"✓ "}</span>
        <span className="text-foreground">{line.text}</span>
      </div>
    )
  }

  if (line.kind === "blank") {
    return <div className="whitespace-pre"> </div>
  }

  return <div className="whitespace-pre text-muted-foreground">{line.text}</div>
}

/**
 * The terminal, running.
 *
 * The card chrome is real DOM; only the printed body is video, rendered on `--card` so the seam
 * between the header row and the output is invisible. The loop prints exactly what the static
 * block used to show, in the order the runner prints it, and the four coverage figures count up
 * rather than appearing: the claim is that a gate reaches a threshold, and a number that arrives
 * already at 100 shows the result without the assertion.
 *
 * The `<pre>` stays in the markup as `sr-only`. Screen readers get the real, selectable output at
 * all times, and under reduced motion it becomes the visible element while the video is removed:
 * the same information either way, minus nothing but movement.
 */
function QualityTerminal({ title }: Readonly<{ title: string }>): JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2.5 border-b border-border bg-background/40 px-4 py-2.5">
        {/* A live dot, on the one element that is genuinely reporting a state. */}
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-ring" />
        <span className="font-mono text-spec text-muted-foreground">{title}</span>
      </div>

      <ConceptLoop className="motion-reduce:hidden max-sm:hidden" name="coverage-run" />

      <pre className="custom-scrollbar sr-only overflow-x-auto p-5 font-mono text-spec leading-[1.9] motion-reduce:not-sr-only max-sm:not-sr-only md:p-7">
        {TERMINAL_LINES.map((line) => (
          <TerminalRow key={line.text || line.kind} line={line} />
        ))}
      </pre>
    </div>
  )
}

function QualitySpec({ label }: Readonly<{ label: string }>): JSX.Element {
  return (
    <li className="flex items-start gap-3">
      <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-ring" strokeWidth={2.25} />
      <span className="font-mono text-spec text-pretty text-muted-foreground">{label}</span>
    </li>
  )
}

/**
 * The evidence beat.
 *
 * The left column argues; the right column shows. The terminal is the one place on the page
 * where the product speaks for itself, so it gets a real bezel and real output rather than a
 * paragraph claiming the same thing. It is a `<pre>` with `aria-hidden` prose beside it, not an
 * image, so the figures stay selectable and searchable.
 *
 * `lg:sticky` on the terminal: the left column is four paragraphs and a CTA, and on a tall
 * viewport the evidence should stay in frame for the whole argument that depends on it.
 */
export async function QualitySection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.quality")

  return (
    <section className="relative border-t border-border" id="quality">
      <div className="mx-auto grid w-full max-w-7xl gap-x-16 gap-y-14 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <Reveal variant="heading">
          <h2 className="max-w-[14ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-xl text-statement text-pretty text-foreground">{t("lead")}</p>
          <p className="mt-5 max-w-xl text-body text-pretty text-muted-foreground">{t("body")}</p>
          <p className="mt-4 max-w-xl text-body text-pretty text-muted-foreground">{t("consequence")}</p>

          <ul className="mt-8 space-y-2.5 border-t border-border pt-8">
            {SPEC_KEYS.map((key) => (
              <QualitySpec key={key} label={t(`specs.${key}`)} />
            ))}
          </ul>

          <a
            className="group mt-10 inline-flex items-center gap-2 rounded-sm text-body-sm font-medium text-foreground transition-colors duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            href="#pricing"
          >
            {t("cta")}
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-200 ease-exp group-hover:translate-x-0.5 motion-reduce:transition-none"
              strokeWidth={2}
            />
          </a>
        </Reveal>

        <Reveal className="min-w-0 lg:sticky lg:top-24" delay={TERMINAL_DELAY_MS}>
          <QualityTerminal title={t("terminalTitle")} />
        </Reveal>
      </div>
    </section>
  )
}
