import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import { Plate } from "../components/plate"
import { MONO } from "../fonts"
import { FPS, THEME } from "../theme"

const PAD = 52
const COMMAND = "bun run test:coverage"

const SUITE_LINES = [
  { label: "Test Files", value: "all passed" },
  { label: "     Tests", value: "all passed" },
] as const

const COVERAGE_ROWS = ["% Stmts", "% Branch", "% Funcs", "% Lines"] as const

const TYPE_START = 0.4 * FPS
const TYPE_END = 2 * FPS
const SPINNER_START = 2.2 * FPS
const SUITE_AT = 4 * FPS
const COVERAGE_START = 5.1 * FPS
const COVERAGE_STEP = 0.5 * FPS
const COUNT_DURATION = 1 * FPS
const GATE_AT = 8.6 * FPS

const LINE_HEIGHT = 40
const DOTS = 46

export function CoverageRun() {
  const frame = useCurrentFrame()

  const typed = Math.round(
    interpolate(frame, [TYPE_START, TYPE_END], [0, COMMAND.length], {
      easing: Easing.bezier(0.35, 0, 0.25, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  )
  const caretVisible = frame < SPINNER_START && Math.floor(frame / 8) % 2 === 0
  const dotsShown = Math.round(
    interpolate(frame, [SPINNER_START, SUITE_AT - 0.2 * FPS], [0, DOTS], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  )

  return (
    <Plate>
      <AbsoluteFill name="Terminal" style={{ fontFamily: MONO, fontSize: 32, padding: PAD }}>
        <Interactive.Div name="Command" style={{ display: "flex", gap: 14 }}>
          <span style={{ color: THEME.mutedForeground }}>$</span>
          <span style={{ color: THEME.foreground }}>
            {COMMAND.slice(0, typed)}
            {caretVisible ? <span style={{ color: THEME.accent }}>▍</span> : undefined}
          </span>
        </Interactive.Div>

        <div style={{ color: THEME.accentMuted, height: LINE_HEIGHT, marginTop: 20, wordBreak: "break-all" }}>{"·".repeat(dotsShown)}</div>

        <div style={{ marginTop: 6 }}>
          {SUITE_LINES.map((line, index) => (
            <div
              key={line.label}
              style={{
                color: THEME.mutedForeground,
                height: LINE_HEIGHT,
                opacity: interpolate(frame, [SUITE_AT + index * 0.18 * FPS, SUITE_AT + index * 0.18 * FPS + 0.22 * FPS], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                whiteSpace: "pre",
              }}
            >
              {`${line.label}  ${line.value}`}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          {COVERAGE_ROWS.map((row, index) => {
            const at = COVERAGE_START + index * COVERAGE_STEP
            const value = Math.round(
              interpolate(frame, [at, at + COUNT_DURATION], [0, 100], {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            )
            const settled = frame >= at + COUNT_DURATION

            return (
              <div key={row} style={{ alignItems: "center", display: "flex", gap: 16, height: LINE_HEIGHT }}>
                <span
                  style={{
                    color: THEME.accent,
                    opacity: settled ? 1 : 0,
                  }}
                >
                  ✓
                </span>
                <span style={{ color: settled ? THEME.foreground : THEME.mutedForeground, whiteSpace: "pre" }}>{row.padEnd(10, " ")}</span>
                <span
                  style={{
                    color: settled ? THEME.foreground : THEME.mutedForeground,
                    fontVariantNumeric: "tabular-nums",
                    opacity: frame >= at ? 1 : 0,
                  }}
                >
                  {value}
                </span>
              </div>
            )
          })}
        </div>

        <Interactive.Div
          name="Gate"
          style={{
            alignItems: "center",
            borderTop: `1px solid ${THEME.hairline}`,
            color: THEME.accent,
            display: "flex",
            gap: 14,
            marginTop: 16,
            opacity: interpolate(frame, [GATE_AT, GATE_AT + 0.35 * FPS], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            paddingTop: 16,
          }}
        >
          <span aria-hidden style={{ backgroundColor: THEME.accent, borderRadius: 2, height: 10, width: 10 }} />
          <span>coverage gate passed</span>
        </Interactive.Div>
      </AbsoluteFill>
    </Plate>
  )
}
