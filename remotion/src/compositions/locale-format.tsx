import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import { Plate } from "../components/plate"
import { MONO } from "../fonts"
import { FPS, THEME, TYPE } from "../theme"

const PAD = 52

/**
 * Six locales out of the catalog's fifty-four, chosen for how differently they render the same
 * two values: decimal comma against decimal point, day-first against year-first, and three
 * writing systems. Latin-only examples would make the point invisible.
 */
const LOCALES = ["en-US", "de-DE", "pl-PL", "ja-JP", "ar-EG", "fr-CA"] as const

/** One number and one instant, formatted by the platform. Nothing here is a translation. */
const SAMPLE_NUMBER = 1_234_567.89
const SAMPLE_DATE = new Date(Date.UTC(2026, 7, 12, 9, 41))

const HOLD = 1.2 * FPS
const CYCLE = HOLD + 0.13 * FPS

function formatNumber(locale: string): string {
  return new Intl.NumberFormat(locale).format(SAMPLE_NUMBER)
}

function formatDate(locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC", year: "numeric" }).format(SAMPLE_DATE)
}

function languageName(locale: string): string {
  const [language] = locale.split("-")
  return new Intl.DisplayNames([locale], { type: "language" }).of(language ?? locale) ?? locale
}

/**
 * THE LOCALE SWITCH — the i18n station's claim, drawn.
 *
 * The same number and the same instant, re-formatted by `Intl` as the locale cycles. Everything
 * on screen is produced by the platform at render time rather than typed in, which is the point:
 * the claim is that formatting is native to the codebase, so the band has to be formatting rather
 * than a picture of formatting. No amounts are converted between currencies, because that would
 * require an exchange rate the page does not have and does not claim.
 */
export function LocaleFormat() {
  const frame = useCurrentFrame()
  const index = Math.min(LOCALES.length - 1, Math.floor(frame / CYCLE))
  const locale = LOCALES[index] ?? LOCALES[0]
  const local = frame - index * CYCLE

  const enter = interpolate(local, [0, 0.32 * FPS], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <Plate ground={THEME.background}>
      <AbsoluteFill name="Rows" style={{ justifyContent: "space-between", padding: PAD }}>
        <div style={{ alignItems: "baseline", display: "flex", justifyContent: "space-between" }}>
          <div style={{ ...TYPE.label, color: THEME.mutedForeground, fontFamily: MONO }}>Locale</div>
          <div style={{ ...TYPE.mono, color: THEME.mutedForeground, fontFamily: MONO }}>54 locales &middot; 195 timezones</div>
        </div>

        <Interactive.Div
          name="Sample"
          style={{
            opacity: enter,
            translate: interpolate(local, [0, 0.32 * FPS], ["0px 14px", "0px 0px"], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
            <span aria-hidden style={{ backgroundColor: THEME.accent, borderRadius: 2, height: 12, width: 12 }} />
            <span style={{ ...TYPE.readoutSmall, color: THEME.accent, fontFamily: MONO }}>{locale}</span>
            <span style={{ ...TYPE.readoutSmall, color: THEME.mutedForeground, fontWeight: 400 }}>{languageName(locale)}</span>
          </div>

          <div style={{ display: "flex", gap: 64, marginTop: 26 }}>
            <div>
              <div style={{ ...TYPE.label, color: THEME.mutedForeground, fontFamily: MONO }}>Number</div>
              <div style={{ ...TYPE.readoutSmall, color: THEME.foreground, fontVariantNumeric: "tabular-nums", marginTop: 10 }}>
                {formatNumber(locale)}
              </div>
            </div>
            <div>
              <div style={{ ...TYPE.label, color: THEME.mutedForeground, fontFamily: MONO }}>Date</div>
              <div style={{ ...TYPE.readoutSmall, color: THEME.foreground, marginTop: 10 }}>{formatDate(locale)}</div>
            </div>
          </div>
        </Interactive.Div>

        {/* The catalog as a progress rail: one tick per locale on screen, the rest implied. */}
        <div style={{ display: "flex", gap: 8 }}>
          {LOCALES.map((code, tick) => (
            <span
              key={code}
              style={{
                backgroundColor: tick === index ? THEME.accent : THEME.muted,
                borderRadius: 2,
                height: 4,
                width: tick === index ? 88 : 44,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </Plate>
  )
}
