import { readFileSync, writeFileSync } from "node:fs"

const COMMIT_EMOJIS: Readonly<Record<string, string>> = {
  build: "🛠️",
  chore: "♻️",
  ci: "⚙️",
  docs: "📚",
  feat: "✨",
  fix: "🐛",
  perf: "🚀",
  refactor: "📦",
  revert: "🗑️",
  style: "💎",
  test: "🚨",
}

const CONVENTIONAL_PATTERN = /^([a-z]+)(?:\([^)]*\))?!?:\s/
const EMOJI_PRESENTATION = /^\p{Emoji_Presentation}/u
const GIT_GENERATED_SUBJECT = /^(?:Merge |Revert "|fixup! |squash! )/

const SKIP_SOURCES = new Set(["squash", "merge", "template"])

function getFirstNonCommentLine(raw: string): string | undefined {
  for (const line of raw.split("\n")) {
    const trimmed = line.trim()
    if (trimmed.length === 0 || trimmed.startsWith("#")) {
      continue
    }

    return trimmed
  }

  return undefined
}

function run(): void {
  const msgFile = process.argv[2]
  const source = process.argv[3]

  if (msgFile === undefined) {
    return
  }

  if (source !== undefined && SKIP_SOURCES.has(source)) {
    return
  }

  const raw = readFileSync(msgFile, "utf-8")
  const subject = getFirstNonCommentLine(raw)

  if (subject === undefined || subject.length === 0 || EMOJI_PRESENTATION.test(subject)) {
    return
  }

  const match = CONVENTIONAL_PATTERN.exec(subject)

  if (match === null) {
    if (GIT_GENERATED_SUBJECT.test(subject)) {
      return
    }

    const allowed = Object.keys(COMMIT_EMOJIS).join(", ")
    process.stderr.write("\n❌  Commit message does not follow conventional format.\n")
    process.stderr.write("   Expected: <type>(<scope>): <description>\n")
    process.stderr.write(`   Allowed types: ${allowed}\n\n`)
    process.exit(1)
  }

  const type = match[1]
  const emoji = type === undefined ? undefined : COMMIT_EMOJIS[type]

  if (emoji === undefined) {
    const allowed = Object.keys(COMMIT_EMOJIS).join(", ")
    process.stderr.write(`\n❌  Unknown commit type: "${type ?? "unknown"}"\n`)
    process.stderr.write(`   Allowed types: ${allowed}\n\n`)
    process.exit(1)
  }

  const lines = raw.split("\n")
  let updated = false

  const nextLines = lines.map((line) => {
    if (updated || line.trim().length === 0 || line.trim().startsWith("#")) {
      return line
    }

    updated = true
    return `${emoji} ${line.trimEnd()}`
  })

  writeFileSync(msgFile, `${nextLines.join("\n").replace(/\n?$/, "\n")}`)
}

try {
  run()
} catch (error) {
  process.stderr.write(`\n❌  Failed to process commit message: ${String(error)}\n\n`)
  process.exit(1)
}
