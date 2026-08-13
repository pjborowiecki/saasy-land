import type { Transition } from "motion/react"

/**
 * The page's easing, restated for Motion.
 *
 * `--ease-exp` in `globals.css` is `cubic-bezier(0.16, 1, 0.3, 1)` and every CSS transition on
 * the page uses it. These are the same curve and the same durations, so a row that fades under
 * CSS and a row that travels under Motion decelerate identically. Two easing systems on one page
 * is the kind of mismatch nobody can name but everybody feels.
 *
 * Hoisted to module scope, not written inline. A transition object created in a render is a new
 * object on every pass, which defeats prop comparison and trips the repo's react-perf rules.
 */
const CURVE_P1X = 0.16
const CURVE_P1Y = 1
const CURVE_P2X = 0.3
const CURVE_P2Y = 1

/** The four control points of `--ease-exp`, hoisted so the numbers are named exactly once. */
const EASE_EXP: readonly [number, number, number, number] = [CURVE_P1X, CURVE_P1Y, CURVE_P2X, CURVE_P2Y]

const DURATION = 0.4
const DURATION_FAST = 0.2

export const EXP: Transition = { duration: DURATION, ease: EASE_EXP }

/** The same curve, for state changes that should read as instant rather than as movement. */
export const EXP_FAST: Transition = { duration: DURATION_FAST, ease: EASE_EXP }

/**
 * For things the visitor caused.
 *
 * A spring, not a curve, because a duration cannot be interrupted gracefully: click twice and a
 * tween restarts from wherever it got to, while a spring carries its velocity into the new
 * target. The page's one working control is a row of buttons people will mash, so it springs.
 */
const PRESS_DAMPING = 30
const PRESS_MASS = 0.6
const PRESS_STIFFNESS = 420

export const PRESS: Transition = { damping: PRESS_DAMPING, mass: PRESS_MASS, stiffness: PRESS_STIFFNESS, type: "spring" }

const TAP_SCALE = 0.97

/** The press. Small enough to feel like travel in the button, not like the button resizing. */
export const TAP = { scale: TAP_SCALE }

const PROGRESS_DAMPING = 32
const PROGRESS_STIFFNESS = 220
const PROGRESS_REST_DELTA = 0.001

/**
 * The scroll progress hairline.
 *
 * Sprung rather than bound straight to `scrollYProgress`, because a raw binding tracks a trackpad
 * flick with perfect fidelity and reads as nervous. The spring is stiff enough to stay honest
 * about position and slack enough to smooth the jitter out of a fast scroll.
 */
export const PROGRESS_SPRING = { damping: PROGRESS_DAMPING, restDelta: PROGRESS_REST_DELTA, stiffness: PROGRESS_STIFFNESS }

const SWAP_STIFFNESS = 260
const SWAP_DAMPING = 18

/** The glyph swap. Loose enough to overshoot a little, which is what makes it read as a reply. */
export const SWAP = { damping: SWAP_DAMPING, stiffness: SWAP_STIFFNESS, type: "spring" as const }

const DRAW_STIFFNESS = 300
const DRAW_DAMPING = 25
const DRAW_DELAY = 0.1

/** The tick drawing itself. Delayed a beat so the stroke starts after the glyph has arrived. */
export const DRAW = { damping: DRAW_DAMPING, delay: DRAW_DELAY, stiffness: DRAW_STIFFNESS, type: "spring" as const }
