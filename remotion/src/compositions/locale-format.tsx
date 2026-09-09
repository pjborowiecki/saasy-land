import { I18N, type SupportedLocale } from "../../../src/integrations/use-intl/i18n.config"

import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import { Plate } from "../components/plate"
import { MONO } from "../fonts"
import { FPS, THEME, TYPE } from "../theme"

const PAD = 52

const LOCALES = ["en-US", "de-DE", "pl-PL", "ja-JP", "es-ES", "fr-FR"] as const satisfies readonly SupportedLocale[]

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
          <div style={{ ...TYPE.mono, color: THEME.mutedForeground, fontFamily: MONO }}>
            {I18N.SUPPORTED_LOCALES.length} languages &middot; Intl formatting
          </div>
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
