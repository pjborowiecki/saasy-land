import type { Transition } from "motion/react"

// Keep Motion's curve aligned with --ease-exp in globals.css.
const EASE_EXP_X1 = 0.16
const EASE_EXP_Y1 = 1
const EASE_EXP_X2 = 0.3
const EASE_EXP_Y2 = 1

const EASE_EXP: readonly [number, number, number, number] = [EASE_EXP_X1, EASE_EXP_Y1, EASE_EXP_X2, EASE_EXP_Y2]

export const EXP: Transition = { duration: 0.4, ease: EASE_EXP }
export const EXP_FAST: Transition = { duration: 0.2, ease: EASE_EXP }
export const PRESS: Transition = { damping: 30, mass: 0.6, stiffness: 420, type: "spring" }
export const TAP = { scale: 0.97 }
export const PROGRESS_SPRING = { damping: 32, restDelta: 0.001, stiffness: 220 }
export const SWAP = { damping: 18, stiffness: 260, type: "spring" as const }
export const DRAW = { damping: 25, delay: 0.1, stiffness: 300, type: "spring" as const }
