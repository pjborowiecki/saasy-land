import { readFileSync, writeFileSync } from "node:fs";

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
  test: "🚨"
};

const CONVENTIONAL_PATTERN = /^([a-z]+)(?:\([^)]*\))?!?:\s/;
const EMOJI_PRESENTATION = /^\p{Emoji_Presentation}/u;

function run(): void {
  const msgFile = process.argv[2];
  if (msgFile === undefined) return;

  const msg = readFileSync(msgFile, "utf-8").trim();
  if (msg.length === 0 || EMOJI_PRESENTATION.test(msg)) return;

  const match = CONVENTIONAL_PATTERN.exec(msg);

  if (match === null) {
    const isGitGenerated = /^(?:Merge |Revert "|fixup! |squash! )/.test(msg);
    if (isGitGenerated) return;

    const allowed = Object.keys(COMMIT_EMOJIS).join(", ");
    process.stderr.write("\n❌  Commit message does not follow conventional format.\n");
    process.stderr.write("   Expected: <type>(<scope>): <description>\n");
    process.stderr.write(`   Allowed types: ${allowed}\n\n`);
    process.exit(1);
  }

  const type = match[1];
  const emoji = type === undefined ? undefined : COMMIT_EMOJIS[type];

  if (emoji === undefined) {
    const allowed = Object.keys(COMMIT_EMOJIS).join(", ");
    process.stderr.write(`\n❌  Unknown commit type: "${type ?? "unknown"}"\n`);
    process.stderr.write(`   Allowed types: ${allowed}\n\n`);
    process.exit(1);
  }

  writeFileSync(msgFile, `${emoji} ${msg}\n`);
}

try {
  run();
} catch (error) {
  process.stderr.write(`\n❌  Failed to process commit message: ${String(error)}\n\n`);
  process.exit(1);
}
