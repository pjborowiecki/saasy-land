// Mirror the dark palette in src/presentation/styles/globals.css when re-rendering videos.
export const THEME = {
  accent: "oklch(0.775 0.108 199)",

  accentDim: "oklch(0.775 0.108 199 / 0.16)",
  accentMuted: "oklch(0.775 0.108 199 / 0.45)",

  background: "oklch(0.168 0.005 265)",

  card: "oklch(0.204 0.006 265)",
  destructive: "oklch(0.704 0.191 22.216)",
  foreground: "oklch(0.977 0.002 265)",

  hairline: "oklch(0.28 0.006 265)",

  hairlineLit: "oklch(0.36 0.007 265)",
  muted: "oklch(0.246 0.007 265)",
  mutedForeground: "oklch(0.715 0.012 265)",

  series: "oklch(0.55 0.075 245)",
  seriesDim: "oklch(0.55 0.075 245 / 0.22)",

  sidebar: "oklch(0.152 0.005 265)",
} as const

export const FPS = 60

export const BAND = { height: 440, width: 1200 } as const

export const SURFACE = { height: 1000, width: 1600 } as const

export const SURFACE_DURATION = 10 * FPS

export const TERMINAL = { height: 520, width: 1200 } as const

export const BAND_DURATION = 8 * FPS

export const TERMINAL_DURATION = 11 * FPS

export const SEAM = 0.4 * FPS

export const TYPE = {
  label: { fontSize: 30, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase" },
  mono: { fontSize: 28, fontWeight: 400, letterSpacing: "0.01em" },
  readout: { fontSize: 78, fontWeight: 600, letterSpacing: "-0.035em" },
  readoutSmall: { fontSize: 54, fontWeight: 600, letterSpacing: "-0.03em" },
} as const
