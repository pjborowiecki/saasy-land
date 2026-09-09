import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import { Header, Panel, Rail } from "../components/app-chrome"
import { Plate } from "../components/plate"
import { MONO, SANS } from "../fonts"
import { FPS, THEME } from "../theme"

const PAD = 28
const CHART_W = 1160
const CHART_H = 210

const STATS = [
  { label: "Registered users", value: "2,841" },
  { label: "Products in catalog", value: "36" },
  { label: "Pending email verification", value: "12" },
] as const

const SERIES = [0.22, 0.24, 0.23, 0.3, 0.52, 0.6, 0.57, 0.59, 0.62, 0.55, 0.58, 0.78] as const

const ROWS = [
  { email: "marta@northwind.dev", name: "Marta Kowalczyk", role: "Admin", state: "active" },
  { email: "dele@okonkwo.io", name: "Dele Okonkwo", role: "Customer", state: "active" },
  { email: "hana@nakamura.jp", name: "Hana Nakamura", role: "Customer", state: "pending" },
  { email: "rafael@santos.br", name: "Rafael Santos", role: "Customer", state: "active" },
] as const

const KPIS = [
  { label: "Total MRR", value: "$124,500" },
  { label: "Active users", value: "45,231" },
  { label: "Churn rate", value: "1.2%" },
  { label: "Avg. revenue / user", value: "$42.50" },
] as const

const BARS = [0.45, 0.35, 0.62, 0.5, 0.4, 0.7, 0.86, 0.55, 0.45, 0.3, 0.66, 0.76, 0.92, 0.8, 0.6, 0.51, 0.71, 0.42] as const

// The tour starts and ends on the same dashboard frame; its poster is frame 0.
const TOUR_TO_ANALYTICS = 1.4 * FPS
const TOUR_TO_DASHBOARD = 5.2 * FPS

const FADE = 0.22 * FPS
const GAP = 0.34 * FPS

const HIGHLIGHT_FROM = 6.4 * FPS
const HIGHLIGHT_STEP = 0.5 * FPS

interface Point {
  readonly x: number
  readonly y: number
}

function pointAt(index: number): Point {
  return { x: (index / (SERIES.length - 1)) * CHART_W, y: CHART_H - (SERIES[index] ?? 0) * CHART_H }
}

// Catmull-Rom tangents converted to cubic Bézier controls.
function seriesPath(close: boolean): string {
  const points = SERIES.map((_, index) => pointAt(index))
  const segments: string[] = [`M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`]

  for (let index = 0; index < points.length - 1; index++) {
    const previous = points[Math.max(0, index - 1)]
    const current = points[index]
    const next = points[index + 1]
    const after = points[Math.min(points.length - 1, index + 2)]
    const c1 = { x: current.x + (next.x - previous.x) / 6, y: current.y + (next.y - previous.y) / 6 }
    const c2 = { x: next.x - (after.x - current.x) / 6, y: next.y - (after.y - current.y) / 6 }
    segments.push(`C${c1.x.toFixed(2)} ${c1.y.toFixed(2)} ${c2.x.toFixed(2)} ${c2.y.toFixed(2)} ${next.x.toFixed(2)} ${next.y.toFixed(2)}`)
  }

  const path = segments.join(" ")
  return close ? `${path} L${CHART_W} ${CHART_H} L0 ${CHART_H} Z` : path
}

function StatPlate() {
  return (
    <div
      style={{
        backgroundColor: THEME.hairline,
        border: `1px solid ${THEME.hairline}`,
        borderRadius: 14,
        columnGap: 1,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        overflow: "hidden",
      }}
    >
      {STATS.map((stat) => (
        <div key={stat.label} style={{ backgroundColor: THEME.card, padding: "22px 26px" }}>
          <div
            style={{
              color: THEME.mutedForeground,
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            {stat.label}
          </div>
          <div
            style={{
              color: THEME.foreground,
              fontFamily: SANS,
              fontSize: 40,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              marginTop: 10,
            }}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}

function DashboardScreen({ highlighted }: Readonly<{ highlighted: number }>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <StatPlate />

      <Panel style={{ padding: 26 }}>
        <div style={{ color: THEME.foreground, fontFamily: SANS, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Revenue Overview
        </div>
        <div style={{ color: THEME.mutedForeground, fontFamily: SANS, fontSize: 15, marginTop: 4 }}>
          Monthly recurring revenue over the last 12 months
        </div>
        <svg height={CHART_H} style={{ marginTop: 18 }} viewBox={`0 0 ${CHART_W} ${CHART_H}`} width={CHART_W}>
          <defs>
            <linearGradient id="tourFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={THEME.accent} stopOpacity={0.24} />
              <stop offset="100%" stopColor={THEME.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((line) => (
            <line
              key={line}
              stroke={THEME.hairline}
              strokeWidth={1}
              x1={0}
              x2={CHART_W}
              y1={(line / 3) * CHART_H}
              y2={(line / 3) * CHART_H}
            />
          ))}
          <path d={seriesPath(true)} fill="url(#tourFill)" />
          <path d={seriesPath(false)} fill="none" stroke={THEME.accent} strokeLinecap="round" strokeWidth={3} />
        </svg>
      </Panel>

      <Panel>
        <div
          style={{
            borderBottom: `1px solid ${THEME.hairline}`,
            color: THEME.foreground,
            fontFamily: SANS,
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            padding: "18px 26px",
          }}
        >
          User Management
        </div>
        {ROWS.map((row, index) => (
          <div
            key={row.email}
            style={{
              alignItems: "center",
              backgroundColor: index === highlighted ? THEME.muted : "transparent",
              borderBottom: index === ROWS.length - 1 ? "none" : `1px solid ${THEME.hairline}`,
              display: "flex",
              gap: 16,
              padding: "14px 26px",
            }}
          >
            <span
              style={{
                alignItems: "center",
                backgroundColor: THEME.muted,
                borderRadius: 8,
                color: THEME.foreground,
                display: "flex",
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 600,
                height: 36,
                justifyContent: "center",
                width: 36,
              }}
            >
              {row.name
                .split(" ")
                .map((part) => part.charAt(0))
                .join("")}
            </span>
            <span style={{ flexGrow: 1, minWidth: 0 }}>
              <span style={{ color: THEME.foreground, display: "block", fontFamily: SANS, fontSize: 16, fontWeight: 500 }}>{row.name}</span>
              <span style={{ color: THEME.mutedForeground, display: "block", fontFamily: SANS, fontSize: 14 }}>{row.email}</span>
            </span>
            <span style={{ color: THEME.mutedForeground, fontFamily: SANS, fontSize: 15, width: 130 }}>{row.role}</span>
            <span
              style={{
                alignItems: "center",
                color: row.state === "active" ? THEME.accent : THEME.mutedForeground,
                display: "flex",
                fontFamily: SANS,
                fontSize: 15,
                gap: 9,
                width: 120,
              }}
            >
              <span
                style={{
                  backgroundColor: row.state === "active" ? THEME.accent : THEME.mutedForeground,
                  borderRadius: 999,
                  height: 7,
                  width: 7,
                }}
              />
              {row.state}
            </span>
          </div>
        ))}
      </Panel>
    </div>
  )
}

function AnalyticsScreen({ activeBar }: Readonly<{ activeBar: number }>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(4, 1fr)" }}>
        {KPIS.map((kpi) => (
          <Panel key={kpi.label} style={{ padding: "22px 24px" }}>
            <div style={{ color: THEME.mutedForeground, fontFamily: SANS, fontSize: 16 }}>{kpi.label}</div>
            <div
              style={{
                color: THEME.foreground,
                fontFamily: SANS,
                fontSize: 36,
                fontVariantNumeric: "tabular-nums",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                marginTop: 12,
              }}
            >
              {kpi.value}
            </div>
          </Panel>
        ))}
      </div>

      <Panel style={{ padding: 26 }}>
        <div style={{ color: THEME.foreground, fontFamily: SANS, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Revenue Overview
        </div>
        <div style={{ color: THEME.mutedForeground, fontFamily: SANS, fontSize: 15, marginTop: 4 }}>
          Daily revenue generated over the last 30 days
        </div>
        <div style={{ alignItems: "flex-end", display: "flex", gap: 12, height: 300, marginTop: 22 }}>
          {BARS.map((bar, index) => (
            <div
              key={index}
              style={{
                backgroundColor: index === activeBar ? THEME.accent : THEME.accentDim,
                borderRadius: 4,
                flexGrow: 1,
                height: `${bar * 100}%`,
              }}
            />
          ))}
        </div>
      </Panel>
    </div>
  )
}

export function AppTour() {
  const frame = useCurrentFrame()

  const dashboardOpacity = interpolate(
    frame,
    [TOUR_TO_ANALYTICS, TOUR_TO_ANALYTICS + FADE, TOUR_TO_DASHBOARD + GAP, TOUR_TO_DASHBOARD + GAP + FADE],
    [1, 0, 0, 1],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  )
  const analyticsOpacity = interpolate(
    frame,
    [TOUR_TO_ANALYTICS + GAP, TOUR_TO_ANALYTICS + GAP + FADE, TOUR_TO_DASHBOARD, TOUR_TO_DASHBOARD + FADE],
    [0, 1, 1, 0],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  )
  const showAnalytics = frame >= TOUR_TO_ANALYTICS + GAP && frame < TOUR_TO_DASHBOARD + GAP

  const highlighted = Math.floor((frame - HIGHLIGHT_FROM) / HIGHLIGHT_STEP)
  const activeBar = 6 + (Math.floor((frame - TOUR_TO_ANALYTICS) / (0.55 * FPS)) % 4)

  return (
    <Plate ground={THEME.background} seam={false}>
      <AbsoluteFill style={{ flexDirection: "row" }}>
        <Rail activeIndex={showAnalytics ? 1 : 0} reveal={() => 1} />

        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}>
          <Header crumb={showAnalytics ? "Analytics" : "Dashboard"} opacity={1} />

          <div style={{ flexGrow: 1, position: "relative" }}>
            <Interactive.Div
              name="Dashboard"
              style={{
                inset: 0,
                opacity: dashboardOpacity,
                padding: PAD,
                position: "absolute",
                translate: `0px ${((1 - dashboardOpacity) * -10).toFixed(2)}px`,
              }}
            >
              <DashboardScreen highlighted={highlighted >= 0 && highlighted < ROWS.length ? highlighted : -1} />
            </Interactive.Div>

            <Interactive.Div
              name="Analytics"
              style={{
                inset: 0,
                opacity: analyticsOpacity,
                padding: PAD,
                position: "absolute",
                translate: `0px ${((1 - analyticsOpacity) * 10).toFixed(2)}px`,
              }}
            >
              <AnalyticsScreen activeBar={activeBar} />
            </Interactive.Div>
          </div>
        </div>
      </AbsoluteFill>
    </Plate>
  )
}
