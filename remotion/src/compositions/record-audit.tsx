import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import { Plate } from "../components/plate"
import { MONO, SANS } from "../fonts"
import { FPS, THEME, TYPE } from "../theme"

const PAD = 52

/**
 * Three of the page's claims and the file each one is read out of. Every path exists in this
 * repository, and every quoted fragment is what that file actually contains: the section's whole
 * promise is that the numbers can be checked, so a loop that invented a source would break the
 * one thing it is there to demonstrate.
 */
const AUDITS = [
  {
    claim: "100% test coverage",
    line: '"lines": { "pct": 100 }',
    path: "coverage/coverage-summary.json",
  },
  {
    claim: "Enforced, not reported",
    line: "run: bun run test:coverage",
    path: ".github/workflows/ci.yml",
  },
  {
    claim: "54 locales, 156 currencies",
    line: "LOCALES: 54 message catalogs",
    path: "src/integrations/next-intl/messages",
  },
] as const

const HOLD = 2.6 * FPS
const RESOLVE = 0.55 * FPS

/**
 * THE AUDIT — the Record section's claim, drawn.
 *
 * A claim on the left, the file it comes from on the right, and the moment between them where the
 * page stops asserting and starts citing. The tick only lands once the line has resolved, because
 * the order is the argument: the number is not true because the page says so, it is true because
 * the file says so.
 */
export function RecordAudit() {
  const frame = useCurrentFrame()
  const index = Math.min(AUDITS.length - 1, Math.floor(frame / HOLD))
  const audit = AUDITS[index] ?? AUDITS[0]
  const local = frame - index * HOLD

  const enter = interpolate(local, [0, 0.3 * FPS], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const resolved = local >= RESOLVE + 0.4 * FPS
  const scan = interpolate(local, [RESOLVE, RESOLVE + 0.4 * FPS], [0, 1], {
    easing: Easing.bezier(0.32, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <Plate ground={THEME.background}>
      <AbsoluteFill style={{ justifyContent: "space-between", padding: PAD }}>
        <div style={{ alignItems: "baseline", display: "flex", justifyContent: "space-between" }}>
          <span style={{ ...TYPE.label, color: THEME.mutedForeground, fontFamily: MONO }}>Claim</span>
          <span style={{ ...TYPE.label, color: THEME.mutedForeground, fontFamily: MONO }}>Where to check it</span>
        </div>

        <Interactive.Div name="Audit" style={{ opacity: enter }}>
          <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
            <span
              style={{
                alignItems: "center",
                backgroundColor: resolved ? THEME.accent : "transparent",
                border: `2px solid ${resolved ? THEME.accent : THEME.hairlineLit}`,
                borderRadius: 6,
                color: THEME.background,
                display: "flex",
                fontSize: 22,
                height: 32,
                justifyContent: "center",
                width: 32,
              }}
            >
              {resolved ? "✓" : ""}
            </span>
            <span style={{ ...TYPE.readoutSmall, color: THEME.foreground, fontFamily: SANS }}>{audit.claim}</span>
          </div>

          {/* The file, with the scan sweeping the quoted line as it resolves. */}
          <div
            style={{
              border: `1px solid ${THEME.hairline}`,
              borderRadius: 12,
              marginTop: 26,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                borderBottom: `1px solid ${THEME.hairline}`,
                color: THEME.mutedForeground,
                fontFamily: MONO,
                fontSize: 24,
                padding: "14px 22px",
              }}
            >
              {audit.path}
            </div>
            <div style={{ padding: "20px 22px", position: "relative" }}>
              <span
                style={{
                  backgroundColor: THEME.accentDim,
                  bottom: 14,
                  left: 14,
                  position: "absolute",
                  scale: `${scan} 1`,
                  top: 14,
                  transformOrigin: "left center",
                  width: "calc(100% - 28px)",
                }}
              />
              <span
                style={{
                  color: resolved ? THEME.foreground : THEME.mutedForeground,
                  fontFamily: MONO,
                  fontSize: 28,
                  position: "relative",
                }}
              >
                {audit.line}
              </span>
            </div>
          </div>
        </Interactive.Div>

        <div style={{ display: "flex", gap: 8 }}>
          {AUDITS.map((item, tick) => (
            <span
              key={item.path}
              style={{
                backgroundColor: tick === index ? THEME.accent : THEME.muted,
                borderRadius: 2,
                height: 4,
                width: tick === index ? 96 : 48,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </Plate>
  )
}
