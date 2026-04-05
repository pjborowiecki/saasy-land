import { readFileSync, writeFileSync } from "node:fs"

const msgFile = process.argv[2]
if (!msgFile) process.exit(0)

try {
  const msg = readFileSync(msgFile, "utf-8").trim()

  if (!msg || /^[^\w\s]/.test(msg)) {
    process.exit(0)
  }

  const emojis: Record<string, string> = {
    build: "🛠️",
    ci: "⚙️",
    chore: "♻️",
    docs: "📚",
    feat: "✨",
    fix: "🐛",
    perf: "🚀",
    refactor: "📦",
    revert: "🗑️",
    style: "💎",
    test: "🚨",
  }

  const match = /^([a-z]+)(?:\(.*\))?!?:/.exec(msg)

  if (match) {
    const type = match[1]
    const emoji = emojis[type]

    if (emoji) {
      const newMsg = `${emoji} ${msg}`
      writeFileSync(msgFile, newMsg)
    }
  }
} catch (error) {
  console.error("Failed to process commit message:", error)
}
