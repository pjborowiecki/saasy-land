import type { ReactNode } from "react"

import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion"

import { SANS } from "../fonts"
import { SEAM, THEME } from "../theme"

/**
 * The ground every composition is drawn on, and the loop seam.
 *
 * `ground` has to match the surface the video is embedded in, exactly. The four concept bands sit
 * on `--background` at the head of a cell in "The line"; the terminal sits on `--card` inside a
 * card in "Quality control". Get this wrong and the video reads as a lighter rectangle pasted
 * onto the page, which is the one thing these are not allowed to look like.
 *
 * The opacity ramp at both ends is what makes `loop` work for a composition whose last frame does
 * not match its first: both ends resolve to the flat ground, so the cut lands on two identical
 * solid colours.
 *
 * Pass `seam={false}` when the composition already ends exactly where it began. A fade is then
 * worse than nothing, because it dips the whole surface to the ground colour once per loop and
 * that dip is precisely what reads as the page reloading.
 */
export function Plate({ children, ground = THEME.card, seam = true }: Readonly<{ children: ReactNode; ground?: string; seam?: boolean }>) {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  return (
    <AbsoluteFill name="Plate" style={{ backgroundColor: ground, color: THEME.foreground, fontFamily: SANS }}>
      <AbsoluteFill
        name="Seam"
        style={{
          opacity: seam
            ? interpolate(frame, [0, SEAM, durationInFrames - SEAM, durationInFrames], [0, 1, 1, 0], {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
