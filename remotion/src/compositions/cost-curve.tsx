import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import { Plate } from "../components/plate"
import { MONO } from "../fonts"
import { BAND, FPS, THEME, TYPE } from "../theme"

const PAD = 52
const CHART_TOP = 214
const CHART_BOTTOM = BAND.height - PAD - 46
const CHART_LEFT = PAD
const CHART_RIGHT = BAND.width - PAD
const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP

/** The claim being drawn: fifty thousand monthly actives, and the bill that does not move. */
const PEAK_USERS = 50_000

const DRAW_START = 0.6 * FPS
const DRAW_END = 5.4 * FPS

/** Enough points that the curve reads as a curve and few enough that the path stays legible. */
const SAMPLES = 64

/**
 * Metered pricing is superlinear against a free tier: nothing until the tier is used up, then a
 * climb that steepens as the multiplier compounds. `t ** 1.7` past the tier is the shape, not a
 * quote of anybody's price sheet, which is why no figure is ever printed against this line.
 */
function meteredCost(t: number): number {
  const FREE_TIER = 0.18
  if (t <= FREE_TIER) {
    return 0
  }
  return ((t - FREE_TIER) / (1 - FREE_TIER)) ** 1.7
}

function meteredPath(progress: number): string {
  const points: string[] = []
  for (let index = 0; index <= SAMPLES; index++) {
    const t = (index / SAMPLES) * progress
    const x = CHART_LEFT + (CHART_RIGHT - CHART_LEFT) * t
    const y = CHART_BOTTOM - CHART_HEIGHT * meteredCost(t)
    points.push(`${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return points.join(" ")
}

/**
 * THE COST CURVE — the auth station's claim, drawn.
 *
 * Two series over the same axis of monthly active users: metered per-user pricing, which is a
 * curve by definition, and a bill that owns its own database, which is a straight line at zero.
 * The metered series is deliberately unlabelled and unscaled. Putting a dollar figure on it would
 * mean quoting a competitor's price sheet from memory, and the argument does not need it: the
 * shape is the argument.
 */
export function CostCurve() {
  const frame = useCurrentFrame()
  const progress = interpolate(frame, [DRAW_START, DRAW_END], [0, 1], {
    easing: Easing.bezier(0.32, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const users = Math.round(progress * PEAK_USERS)

  return (
    <Plate ground={THEME.background}>
      <AbsoluteFill name="Readouts" style={{ padding: PAD }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Interactive.Div name="Users">
            <div style={{ ...TYPE.label, color: THEME.mutedForeground, fontFamily: MONO }}>Monthly active users</div>
            <div style={{ ...TYPE.readout, color: THEME.foreground, fontVariantNumeric: "tabular-nums", marginTop: 14 }}>
              {users.toLocaleString("en-US")}
            </div>
          </Interactive.Div>

          <Interactive.Div name="Bill" style={{ textAlign: "right" }}>
            <div style={{ ...TYPE.label, color: THEME.mutedForeground, fontFamily: MONO }}>Your auth bill</div>
            <div
              style={{
                ...TYPE.readout,
                color: THEME.accent,
                fontVariantNumeric: "tabular-nums",
                marginTop: 14,
              }}
            >
              $0.00
            </div>
          </Interactive.Div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill name="Chart">
        <svg height={BAND.height} viewBox={`0 0 ${BAND.width} ${BAND.height}`} width={BAND.width}>
          <defs>
            <linearGradient id="meteredFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={THEME.series} stopOpacity={0.38} />
              <stop offset="100%" stopColor={THEME.series} stopOpacity={0} />
            </linearGradient>
          </defs>

          <line stroke={THEME.hairline} strokeWidth={1} x1={CHART_LEFT} x2={CHART_RIGHT} y1={CHART_BOTTOM} y2={CHART_BOTTOM} />

          <path
            d={`${meteredPath(progress)} L${(CHART_LEFT + (CHART_RIGHT - CHART_LEFT) * progress).toFixed(1)} ${CHART_BOTTOM} L${CHART_LEFT} ${CHART_BOTTOM} Z`}
            fill="url(#meteredFill)"
          />
          <path d={meteredPath(progress)} fill="none" stroke={THEME.series} strokeLinecap="round" strokeWidth={3} />

          {/* The flat line is drawn last and thicker: it is the one the section is about. */}
          <line
            stroke={THEME.accent}
            strokeLinecap="round"
            strokeWidth={4}
            x1={CHART_LEFT}
            x2={CHART_LEFT + (CHART_RIGHT - CHART_LEFT) * progress}
            y1={CHART_BOTTOM - 3}
            y2={CHART_BOTTOM - 3}
          />
          <circle
            cx={CHART_LEFT + (CHART_RIGHT - CHART_LEFT) * progress}
            cy={CHART_BOTTOM - 3}
            fill={THEME.accent}
            r={7}
            stroke={THEME.background}
            strokeWidth={4}
          />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill name="Legend" style={{ justifyContent: "flex-end", padding: PAD }}>
        <div style={{ display: "flex", gap: 40, ...TYPE.mono, fontFamily: MONO }}>
          <span style={{ alignItems: "center", color: THEME.mutedForeground, display: "flex", gap: 12 }}>
            <span style={{ backgroundColor: THEME.series, height: 3, width: 22 }} />
            metered per user
          </span>
          <span style={{ alignItems: "center", color: THEME.accent, display: "flex", gap: 12 }}>
            <span style={{ backgroundColor: THEME.accent, height: 4, width: 22 }} />
            your database
          </span>
        </div>
      </AbsoluteFill>
    </Plate>
  )
}
