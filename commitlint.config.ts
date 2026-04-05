import config from "@commitlint/config-conventional"
import type { ParserPreset, UserConfig } from "@commitlint/types"
import createPreset from "conventional-changelog-conventionalcommits"

async function createEmojiParser(): Promise<ParserPreset> {
  const emojiRegexPart = Object.values(config.prompt.questions.type.enum)
    .map((value) => value.emoji.trim() + String.raw`\uFE0F?`)
    .join("|")

  const parserOpts = {
    breakingHeaderPattern: new RegExp(String.raw`^(?:${emojiRegexPart})\s+(\w*)(?:\((.*)\))?!:\s+(.*)$`),
    headerPattern: new RegExp(String.raw`^(?:${emojiRegexPart})\s+(\w*)(?:\((.*)\))?!?:\s+(.*)$`),
  }

  const defaultPreset = await createPreset()

  return {
    ...defaultPreset,
    conventionalChangelog: {
      ...defaultPreset.conventionalChangelog,
      parserOpts,
    },
    parserOpts,
    recommendedBumpOpts: {
      ...defaultPreset.recommendedBumpOpts,
      parserOpts,
    },
  }
}

const emojiParser = await createEmojiParser()

export default {
  extends: ["@commitlint/config-conventional"],
  parserPreset: emojiParser,
  rules: {
    "header-max-length": [2, "always", 256],
    "subject-case": [2, "always", "lower-case"],
  },
  prompt: {
    settings: { enableMultipleScopes: true },
    questions: {
      type: {
        enum: {
          build: { emoji: "🛠️ " },
          ci: { emoji: "⚙️ " },
          chore: { emoji: "♻️ " },
          docs: { emoji: "📚 " },
          feat: { emoji: "✨ " },
          fix: { emoji: "🐛 " },
          perf: { emoji: "🚀 " },
          refactor: { emoji: "📦 " },
          revert: { emoji: "🗑️ " },
          style: { emoji: "💎 " },
          test: { emoji: "🚨 " },
        },
        emojiInHeader: true,
      },
    },
  },
} satisfies UserConfig
