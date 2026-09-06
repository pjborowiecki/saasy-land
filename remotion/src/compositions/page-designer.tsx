import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import { Header, Panel } from "../components/app-chrome"
import { Plate } from "../components/plate"
import { MONO, SANS } from "../fonts"
import { FPS, THEME } from "../theme"

const PAD = 28
const LIBRARY = ["Hero Section", "Features Grid", "Video Showcase", "Testimonials", "Pricing Table", "FAQ Accordion"] as const
const ALIGNMENTS = ["Left", "Center", "Right"] as const

/*
 * THE LOOP BEGINS AND ENDS ON THE SAME FRAME.
 *
 * The first version faded the panes in, selected a section, then snapped every property back to
 * its starting value at the loop point. Fading a whole editor in once every ten seconds reads as
 * the page reloading, so the editor is simply always there, and the motion is now a cycle that
 * returns to where it started on its own: alignment steps left, centre, right and back to left,
 * with the padding easing out and back in step with it. Both are real controls, and the canvas
 * answers each one.
 */
const CYCLE = 2.5 * FPS
const ALIGN_SEQUENCE = [0, 1, 2, 0] as const
const PADDING_SEQUENCE = [96, 128, 112, 96] as const

/**
 * THE PAGE DESIGNER — the studio section's claim, drawn.
 *
 * The section promises marketing pages your own team can edit, inside your own admin, rendering
 * your own components. A screenshot can show that the editor exists; only motion can show it
 * being used, so the loop selects a section, changes two properties and watches the canvas
 * respond, which is the entire argument in nine seconds.
 *
 * The three panes, the section library and the property groups are the ones in
 * `admin/landing-page`. The canvas copy is the placeholder that ships with it.
 */
export function PageDesigner() {
  const frame = useCurrentFrame()

  const step = Math.min(ALIGN_SEQUENCE.length - 1, Math.floor(frame / CYCLE))
  const alignIndex = ALIGN_SEQUENCE[step] ?? 0
  const selected = true

  // The padding eases between the sequence's stops rather than jumping, so the canvas grows and
  // Settles the way a dragged control would move it.
  const paddingValue = Math.round(
    interpolate(
      frame,
      PADDING_SEQUENCE.map((_, index) => index * CYCLE),
      [...PADDING_SEQUENCE],
      {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    ),
  )
  const panes = 1

  // The field lights while the value is actually moving, and is dark at both ends of the cycle,
  // So the frame the loop wraps to is identical to the frame it wraps from.
  const editing =
    interpolate(frame % CYCLE, [0, 0.08 * CYCLE, 0.5 * CYCLE, 0.7 * CYCLE], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) > 0.5

  return (
    <Plate ground={THEME.background} seam={false}>
      <AbsoluteFill style={{ flexDirection: "column" }}>
        <Header crumb="Landing Page" opacity={1} />

        <div style={{ display: "flex", flexGrow: 1, gap: 0, opacity: panes, padding: PAD }}>
          <Panel style={{ borderBottomRightRadius: 0, borderRight: "none", borderTopRightRadius: 0, flexShrink: 0, width: 300 }}>
            <div
              style={{
                borderBottom: `1px solid ${THEME.hairline}`,
                color: THEME.mutedForeground,
                fontFamily: MONO,
                fontSize: 13,
                letterSpacing: "0.09em",
                padding: "16px 20px",
                textTransform: "uppercase",
              }}
            >
              Add section
            </div>
            {LIBRARY.map((item, index) => (
              <div
                key={item}
                style={{
                  alignItems: "center",
                  backgroundColor: selected && index === 0 ? THEME.muted : "transparent",
                  borderBottom: `1px solid ${THEME.hairline}`,
                  color: selected && index === 0 ? THEME.foreground : THEME.mutedForeground,
                  display: "flex",
                  fontFamily: SANS,
                  fontSize: 16,
                  gap: 12,
                  padding: "15px 20px",
                }}
              >
                <span
                  style={{
                    backgroundColor: selected && index === 0 ? THEME.accent : THEME.mutedForeground,
                    borderRadius: 3,
                    height: 11,
                    opacity: selected && index === 0 ? 1 : 0.5,
                    width: 11,
                  }}
                />
                {item}
              </div>
            ))}
          </Panel>

          {/* The canvas. Its hero is the thing being edited, so it is the only element that moves
              when a property changes. */}
          <Panel style={{ borderRadius: 0, flexGrow: 1, minWidth: 0, padding: 26 }}>
            <div
              style={{
                border: `1px solid ${selected ? THEME.accent : THEME.hairline}`,
                borderRadius: 10,
                paddingBottom: paddingValue,
                paddingTop: paddingValue,
                position: "relative",
                textAlign: alignIndex === 1 ? "center" : "left",
                transition: "none",
              }}
            >
              {selected ? (
                <span
                  style={{
                    backgroundColor: THEME.foreground,
                    borderRadius: 5,
                    color: THEME.background,
                    fontFamily: MONO,
                    fontSize: 12,
                    left: -1,
                    letterSpacing: "0.08em",
                    padding: "4px 9px",
                    position: "absolute",
                    textTransform: "uppercase",
                    top: -1,
                  }}
                >
                  Hero section
                </span>
              ) : undefined}
              <div style={{ padding: "0 40px" }}>
                <div
                  style={{
                    color: THEME.foreground,
                    fontFamily: SANS,
                    fontSize: 46,
                    fontWeight: 600,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.1,
                  }}
                >
                  Track every pallet
                  <br />
                  from <span style={{ color: THEME.accent }}>dock to shelf</span>
                </div>
                <div style={{ color: THEME.mutedForeground, fontFamily: SANS, fontSize: 19, marginTop: 16 }}>
                  Barcode scanning, cycle counts and reorder alerts in one place.
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: alignIndex === 1 ? "center" : "flex-start",
                    marginTop: 26,
                  }}
                >
                  <span
                    style={{
                      backgroundColor: THEME.foreground,
                      borderRadius: 9,
                      color: THEME.background,
                      fontFamily: SANS,
                      fontSize: 16,
                      fontWeight: 600,
                      padding: "11px 20px",
                    }}
                  >
                    Start free trial
                  </span>
                  <span
                    style={{
                      border: `1px solid ${THEME.hairline}`,
                      borderRadius: 9,
                      color: THEME.foreground,
                      fontFamily: SANS,
                      fontSize: 16,
                      padding: "11px 20px",
                    }}
                  >
                    Book a demo
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                border: `1px solid ${THEME.hairline}`,
                borderRadius: 10,
                marginTop: 16,
                opacity: 0.55,
                padding: "56px 40px",
                textAlign: "center",
              }}
            >
              <div style={{ color: THEME.foreground, fontFamily: SANS, fontSize: 30, fontWeight: 600, letterSpacing: "-0.03em" }}>
                What is included
              </div>
              <div style={{ color: THEME.mutedForeground, fontFamily: SANS, fontSize: 17, marginTop: 10 }}>
                Three tools your floor team uses on every shift.
              </div>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 22 }}>
                {[0, 1, 2].map((tile) => (
                  <span key={tile} style={{ backgroundColor: THEME.muted, borderRadius: 8, height: 68, width: 200 }} />
                ))}
              </div>
            </div>
          </Panel>

          <Panel style={{ borderBottomLeftRadius: 0, borderLeft: "none", borderTopLeftRadius: 0, flexShrink: 0, width: 330 }}>
            <div
              style={{
                alignItems: "center",
                borderBottom: `1px solid ${THEME.hairline}`,
                display: "flex",
                justifyContent: "space-between",
                padding: "16px 20px",
              }}
            >
              <span style={{ color: THEME.foreground, fontFamily: SANS, fontSize: 17, fontWeight: 600 }}>Section properties</span>
            </div>

            <div style={{ borderBottom: `1px solid ${THEME.hairline}`, padding: "18px 20px" }}>
              <div
                style={{
                  color: THEME.mutedForeground,
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                }}
              >
                Alignment
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {ALIGNMENTS.map((option, index) => (
                  <span
                    key={option}
                    style={{
                      backgroundColor: index === alignIndex ? THEME.muted : "transparent",
                      border: `1px solid ${index === alignIndex ? THEME.accent : THEME.hairline}`,
                      borderRadius: 8,
                      color: index === alignIndex ? THEME.foreground : THEME.mutedForeground,
                      fontFamily: SANS,
                      fontSize: 15,
                      padding: "8px 14px",
                    }}
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderBottom: `1px solid ${THEME.hairline}`, padding: "18px 20px" }}>
              <div
                style={{
                  color: THEME.mutedForeground,
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                }}
              >
                Spacing
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {(["Padding top", "Padding bottom"] as const).map((label) => (
                  <div key={label} style={{ flexGrow: 1 }}>
                    <div style={{ color: THEME.mutedForeground, fontFamily: SANS, fontSize: 13 }}>{label}</div>
                    <div
                      style={{
                        alignItems: "center",
                        border: `1px solid ${editing ? THEME.accent : THEME.hairline}`,
                        borderRadius: 8,
                        color: THEME.foreground,
                        display: "flex",
                        fontFamily: MONO,
                        fontSize: 16,
                        fontVariantNumeric: "tabular-nums",
                        justifyContent: "space-between",
                        marginTop: 7,
                        padding: "9px 12px",
                      }}
                    >
                      {paddingValue}
                      <span style={{ color: THEME.mutedForeground, fontSize: 13 }}>px</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Interactive.Div
              name="Publish"
              style={{
                alignItems: "center",
                backgroundColor: THEME.foreground,
                borderRadius: 9,
                color: THEME.background,
                display: "flex",
                fontFamily: SANS,
                fontSize: 16,
                fontWeight: 600,
                justifyContent: "center",
                margin: 20,
                padding: "12px 0",
              }}
            >
              Publish
            </Interactive.Div>
          </Panel>
        </div>
      </AbsoluteFill>
    </Plate>
  )
}
