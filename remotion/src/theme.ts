/**
 * The landing page's tokens, mirrored.
 *
 * These are copies of the `.dark` values in `src/presentation/styles/globals.css`, not imports:
 * the Remotion project is a separate bundle with its own React and its own build, and the
 * rendered frames have to composite seamlessly into a card on the page. If a token is retuned
 * there, retune it here and re-render, or the video will sit on a surface that no longer matches.
 *
 * `border` is given as a solid composite rather than white-alpha, because a video has no page
 * behind it to blend with: the alpha would resolve against the video's own ground twice.
 */
export const THEME = {
  accent: "oklch(0.775 0.108 199)",
  /** The accent at low alpha, for fills under a line and for inactive marks. */
  accentDim: "oklch(0.775 0.108 199 / 0.16)",
  accentMuted: "oklch(0.775 0.108 199 / 0.45)",
  /** The page ground. Used only where a band deliberately reads as a well inside a card. */
  background: "oklch(0.168 0.005 265)",
  /** The card surface every band is rendered on, so the video edge is invisible. */
  card: "oklch(0.204 0.006 265)",
  destructive: "oklch(0.704 0.191 22.216)",
  foreground: "oklch(0.977 0.002 265)",
  /** The hairline, pre-composited over `card`. */
  hairline: "oklch(0.28 0.006 265)",
  /** One step brighter than the hairline, for an edge that has to read as lit. */
  hairlineLit: "oklch(0.36 0.007 265)",
  muted: "oklch(0.246 0.007 265)",
  mutedForeground: "oklch(0.715 0.012 265)",
  /** The receding series in a two-series chart. */
  series: "oklch(0.55 0.075 245)",
  /** The console rail, one step darker than the ground, exactly as `--sidebar` is on the page. */
  sidebar: "oklch(0.152 0.005 265)",
  seriesDim: "oklch(0.55 0.075 245 / 0.22)",
} as const

/**
 * 60fps. These are continuous UI motions - a chart head travelling, rows landing, a track of
 * commits moving - and at 30 the eye reads the steps rather than the movement. Flat vector
 * surfaces compress well enough that the extra frames cost far less than doubling the file.
 *
 * Every timing in every composition is written as `X * FPS`, so changing this preserves every
 * duration in seconds.
 */
export const FPS = 60

/** Every concept band is the same 10:3 plate so the four cells stay on one grid. */
export const BAND = { height: 440, width: 1200 } as const

/**
 * The hero and the studio show whole product surfaces, so they are 16:10 frames rather than
 * bands. 1600 wide is the width the hero's bezel renders at on a large screen; anything larger
 * is resolution the page throws away.
 */
export const SURFACE = { height: 1000, width: 1600 } as const

/** Long enough to assemble a console and let the eye finish reading it. */
export const SURFACE_DURATION = 10 * FPS

/** The terminal is taller: it has eleven lines to print. */
export const TERMINAL = { height: 520, width: 1200 } as const

/** Loop length for the four concept bands. */
export const BAND_DURATION = 8 * FPS

/** The coverage run needs longer: a command, a suite, then four figures counting up. */
export const TERMINAL_DURATION = 11 * FPS

/**
 * The loop seam, in frames. Every composition fades from and to the flat ground across it, so the
 * cut from the last frame back to the first lands on two identical surfaces and the `loop`
 * attribute never shows a jump.
 */
export const SEAM = 0.4 * FPS

export const TYPE = {
  label: { fontSize: 30, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase" },
  mono: { fontSize: 28, fontWeight: 400, letterSpacing: "0.01em" },
  readout: { fontSize: 78, fontWeight: 600, letterSpacing: "-0.035em" },
  readoutSmall: { fontSize: 54, fontWeight: 600, letterSpacing: "-0.03em" },
} as const
