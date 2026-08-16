import type { JSX, ReactNode } from "react"

interface AccentProps {
  readonly children: ReactNode
  /** Unique per instance: two accents on one page would otherwise share a gradient id. */
  readonly id: string
}

export function Accent({ children, id }: AccentProps): JSX.Element {
  const gradientId = `accent-stroke-${id}`

  return (
    <span className="relative inline md:inline-block">
      <span className="bg-gradient-to-r from-ring via-ring to-chart-2 bg-clip-text text-transparent">{children}</span>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-[0.17em] hidden h-[0.2em] w-full overflow-visible md:block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 300 16"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--ring)" />
            <stop offset="100%" stopColor="var(--chart-2)" />
          </linearGradient>
        </defs>
        <path
          d="M3 11.5C54 4.2 116 2.4 172 4.6S258 11 297 6.2"
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeWidth={3.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  )
}
