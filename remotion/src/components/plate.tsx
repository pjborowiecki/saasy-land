import type { ReactNode } from "react"

import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion"

import { SANS } from "../fonts"
import { SEAM, THEME } from "../theme"

// Match the surrounding surface; fading both ends to it keeps the video loop seamless.
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
