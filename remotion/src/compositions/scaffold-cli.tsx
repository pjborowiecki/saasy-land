import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import { Plate } from "../components/plate"
import { MONO } from "../fonts"
import { FPS, THEME } from "../theme"

const PAD = 52
const COMMAND = "bunx saasyland@latest init"

const PROMPT = "What are you building?"
const ANSWER = "A multi-tenant SaaS"

const TREE = ["src/routes", "src/modules", "src/integrations", "src/presentation", "src/platform", "e2e"] as const

const TYPE_START = 0.35 * FPS
const TYPE_END = 2.1 * FPS
const PROMPT_AT = 2.45 * FPS
const ANSWER_AT = 3.1 * FPS
const TREE_START = 3.7 * FPS
const TREE_STEP = 0.32 * FPS

const LINE_HEIGHT = 40
const COLUMNS = 2

export function ScaffoldCli() {
  const frame = useCurrentFrame()

  const typed = Math.round(
    interpolate(frame, [TYPE_START, TYPE_END], [0, COMMAND.length], {
      easing: Easing.bezier(0.35, 0, 0.25, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  )
  const caretVisible = frame < ANSWER_AT && Math.floor(frame / 8) % 2 === 0

  return (
    <Plate ground={THEME.background}>
      <AbsoluteFill name="Terminal" style={{ fontFamily: MONO, fontSize: 32, justifyContent: "center", padding: PAD }}>
        <Interactive.Div name="Command" style={{ display: "flex", gap: 12 }}>
          <span style={{ color: THEME.mutedForeground }}>$</span>
          <span style={{ color: THEME.foreground }}>
            {COMMAND.slice(0, typed)}
            {caretVisible ? <span style={{ color: THEME.accent }}>▍</span> : undefined}
          </span>
        </Interactive.Div>

        <div
          style={{
            marginTop: 22,
            opacity: interpolate(frame, [PROMPT_AT, PROMPT_AT + 0.3 * FPS], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span style={{ color: THEME.mutedForeground }}>? </span>
          <span style={{ color: THEME.mutedForeground }}>{PROMPT} </span>
          <span
            style={{
              color: THEME.accent,
              opacity: interpolate(frame, [ANSWER_AT, ANSWER_AT + 0.25 * FPS], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {ANSWER}
          </span>
        </div>

        <div
          style={{
            columnGap: 72,
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateColumns: `repeat(${COLUMNS}, max-content)`,
            gridTemplateRows: `repeat(${Math.ceil(TREE.length / COLUMNS)}, ${LINE_HEIGHT}px)`,
            marginTop: 24,
          }}
        >
          {TREE.map((path, index) => {
            const at = TREE_START + index * TREE_STEP
            return (
              <div
                key={path}
                style={{
                  alignItems: "center",
                  display: "flex",
                  gap: 14,
                  opacity: interpolate(frame, [at, at + 0.22 * FPS], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  translate: interpolate(frame, [at, at + 0.28 * FPS], ["-10px 0px", "0px 0px"], {
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <span aria-hidden style={{ backgroundColor: THEME.accent, borderRadius: 2, height: 9, width: 9 }} />
                <span style={{ color: THEME.mutedForeground }}>{path}</span>
              </div>
            )
          })}
        </div>
      </AbsoluteFill>
    </Plate>
  )
}
