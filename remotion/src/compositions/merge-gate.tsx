import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import { Plate } from "../components/plate"
import { MONO } from "../fonts"
import { BAND, FPS, THEME, TYPE } from "../theme"

const PAD = 52
const TRACK_Y = 258
const GATE_X = 690
const GATE_WIDTH = 132
const ENTRY_X = PAD + 10
const EXIT_X = BAND.width - PAD - 10

/**
 * Five commits, one of which does not compile. The failing one is fourth, late enough that the
 * viewer has learned what "passing" looks like before they are shown what happens when it does
 * not, and early enough that the loop still ends on a merge.
 */
const COMMITS = [
  { enters: 0.35 * FPS, passes: true, sha: "4f1c9ab" },
  { enters: 1.5 * FPS, passes: true, sha: "b0e72d4" },
  { enters: 2.65 * FPS, passes: true, sha: "9ac31fe" },
  { enters: 3.8 * FPS, passes: false, sha: "1d84b60" },
  { enters: 5.3 * FPS, passes: true, sha: "77e0c52" },
] as const

/** Frames from entering the track to reaching the gate, and from the gate to main. */
const TO_GATE = 1.15 * FPS
const AT_GATE = 0.75 * FPS
const TO_MAIN = 1 * FPS

interface CommitState {
  readonly opacity: number
  readonly tone: string
  readonly x: number
}

/**
 * Where a commit is, and what colour it has earned.
 *
 * A passing commit runs entry to gate, holds while the gate checks it, then continues into main.
 * A failing one stops at the gate, turns to `--destructive` and fades: the gate is the whole
 * point of the station, so the failure has to be visibly *stopped* rather than merely marked.
 */
function commitState(commit: (typeof COMMITS)[number], frame: number): CommitState {
  const local = frame - commit.enters
  const gateArrival = TO_GATE
  const gateRelease = TO_GATE + AT_GATE

  if (local < 0) {
    return { opacity: 0, tone: THEME.mutedForeground, x: ENTRY_X }
  }

  const approach = interpolate(local, [0, gateArrival], [ENTRY_X, GATE_X], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  if (local < gateRelease) {
    return { opacity: 1, tone: THEME.mutedForeground, x: approach }
  }

  if (!commit.passes) {
    return {
      opacity: interpolate(local, [gateRelease, gateRelease + 0.9 * FPS], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      tone: THEME.destructive,
      x: GATE_X,
    }
  }

  return {
    opacity: interpolate(local, [gateRelease + TO_MAIN - 6, gateRelease + TO_MAIN], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    tone: THEME.accent,
    x: interpolate(local, [gateRelease, gateRelease + TO_MAIN], [GATE_X, EXIT_X], {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  }
}

/** True while any commit is being examined, which is when the gate should look busy. */
function activeCommit(frame: number) {
  return COMMITS.find((commit) => {
    const local = frame - commit.enters
    return local >= TO_GATE - 4 && local < TO_GATE + AT_GATE + (commit.passes ? 0 : 0.9 * FPS)
  })
}

/**
 * True only once the gate has actually returned a verdict on a failing commit. The heading used
 * to flip the moment a bad commit *arrived*, so it announced a rejection while the checks were
 * still running and the square was still neutral.
 */
function isRejecting(frame: number): boolean {
  const commit = activeCommit(frame)
  return commit !== undefined && !commit.passes && frame - commit.enters >= TO_GATE + AT_GATE
}

/**
 * THE MERGE GATE — the tests station's claim, drawn.
 *
 * Commits travel a track toward a gate that runs the suite. Green ones continue into main; the
 * one that breaks something is stopped at the gate and never reaches it. The gate is labelled
 * with what it actually enforces, and the counter underneath is the real suite size.
 */
export function MergeGate() {
  const frame = useCurrentFrame()
  const examining = activeCommit(frame)
  const failing = isRejecting(frame)
  const examineLocal = examining === undefined ? 0 : frame - examining.enters - TO_GATE
  const checkProgress = interpolate(examineLocal, [0, AT_GATE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <Plate ground={THEME.background}>
      <AbsoluteFill name="Rail">
        <svg height={BAND.height} viewBox={`0 0 ${BAND.width} ${BAND.height}`} width={BAND.width}>
          <line stroke={THEME.hairline} strokeWidth={2} x1={ENTRY_X} x2={EXIT_X} y1={TRACK_Y} y2={TRACK_Y} />
          <line stroke={THEME.accentMuted} strokeWidth={2} x1={GATE_X + GATE_WIDTH / 2} x2={EXIT_X} y1={TRACK_Y} y2={TRACK_Y} />

          {/* The gate. Its edge takes the accent while it is working and the alarm when it stops
              something, because the border is the only part of it that ever changes. */}
          <rect
            fill={THEME.card}
            height={112}
            rx={14}
            stroke={examining === undefined ? THEME.hairlineLit : (failing ? THEME.destructive : THEME.accent)}
            strokeWidth={2}
            width={GATE_WIDTH}
            x={GATE_X - GATE_WIDTH / 2}
            y={TRACK_Y - 56}
          />

          {[0, 1, 2, 3].map((index) => (
            <rect
              fill={checkProgress > (index + 1) / 4 ? (failing && index === 3 ? THEME.destructive : THEME.accent) : THEME.muted}
              height={8}
              key={index}
              rx={2}
              width={22}
              x={GATE_X - 47 + index * 26}
              y={TRACK_Y + 16}
            />
          ))}

          {COMMITS.map((commit) => {
            const state = commitState(commit, frame)
            return (
              <g key={commit.sha} opacity={state.opacity}>
                <rect fill={state.tone} height={18} rx={4} width={18} x={state.x - 9} y={TRACK_Y - 9} />
              </g>
            )
          })}
        </svg>
      </AbsoluteFill>

      <AbsoluteFill name="Labels" style={{ padding: PAD }}>
        <Interactive.Div name="Heading">
          <div style={{ ...TYPE.label, color: THEME.mutedForeground, fontFamily: MONO }}>Every pull request</div>
          <div style={{ ...TYPE.readoutSmall, color: THEME.foreground, marginTop: 12 }}>
            {failing ? "Blocked at the gate" : "Coverage gate"}
          </div>
        </Interactive.Div>
      </AbsoluteFill>

      <AbsoluteFill name="Track labels" style={{ justifyContent: "flex-end", padding: PAD }}>
        <div style={{ display: "flex", justifyContent: "space-between", ...TYPE.mono, fontFamily: MONO }}>
          <span style={{ color: THEME.mutedForeground }}>140 test files &middot; 5 suites</span>
          <span style={{ color: THEME.accent }}>main</span>
        </div>
      </AbsoluteFill>
    </Plate>
  )
}
