import { type JSX, type ReactNode, createContext, use, useMemo, useState } from "react"

import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "~/src/lib/cn"

import { PRESS } from "~/src/presentation/components/custom/landing-page/constants/motion-tokens"

const HIDDEN = { opacity: 0 }
const SHOWN = { opacity: 1 }

interface HighlightState {
  readonly hovered?: string | undefined
  readonly name: string
  readonly setHovered: (id?: string) => void
}

const ignoreHover = (): void => {}

const HighlightContext = createContext<HighlightState>({ name: "", setHovered: ignoreHover })

interface HighlightGroupProps {
  readonly children: ReactNode
  readonly className: string
  readonly element?: "div" | "dl"
  readonly name: string
}

const HighlightSurface = ({ children, className, element, onMouseLeave }: HighlightSurfaceProps): JSX.Element => {
  if (element === "dl") {
    return (
      <div onMouseLeave={onMouseLeave}>
        <dl className={className}>{children}</dl>
      </div>
    )
  }

  return (
    <div className={className} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  )
}

export const HighlightGroup = ({ children, className, element = "div", name }: HighlightGroupProps): JSX.Element => {
  const [hovered, setHovered] = useState<string>()
  const state = useMemo<HighlightState>(() => ({ hovered, name, setHovered }), [hovered, name])

  return (
    <HighlightContext value={state}>
      <HighlightSurface
        className={className}
        element={element}
        onMouseLeave={() => {
          setHovered(undefined)
        }}
      >
        {children}
      </HighlightSurface>
    </HighlightContext>
  )
}

interface HighlightSurfaceProps {
  readonly children: ReactNode
  readonly className?: string | undefined
  readonly element: "div" | "dl"
  readonly onMouseLeave: () => void
}

interface HighlightItemProps {
  readonly children: ReactNode
  readonly className?: string
  readonly contentClassName?: string
  readonly id: string
}

export const HighlightItem = ({ children, className, contentClassName, id }: HighlightItemProps): JSX.Element => {
  const { hovered, name, setHovered } = use(HighlightContext)
  const isLit = hovered === id

  return (
    <div
      className={cn("relative", isLit && "z-10", className)}
      onMouseEnter={() => {
        setHovered(id)
      }}
    >
      {/* Raise the active cell above opaque siblings while the shared highlight moves. */}
      <AnimatePresence>
        {isLit && (
          <m.div
            animate={SHOWN}
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-muted/45"
            exit={HIDDEN}
            initial={HIDDEN}
            key={name}
            layoutId={name}
            transition={PRESS}
          />
        )}
      </AnimatePresence>
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  )
}
