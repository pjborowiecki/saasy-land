
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, symlinkSync } from "node:fs"
import { join } from "node:path"

const GROUPS: Record<string, string> = {
  "anthropics/skills": "anthropic",
  "better-auth/skills": "better-auth",
  "elysiajs/skills": "elysiajs",
  "Leonxlnx/taste-skill": "taste",
  "mattpocock/skills": "matt-pocock",
  "neondatabase/agent-skills": "neon",
  "neondatabase/ai-rules": "neon",
  "next-safe-action/skills": "next-safe-action",
  "pbakaus/impeccable": "impeccable",
  "remotion": "remotion",
  "resend/resend-skills": "resend",
  "stripe/ai": "stripe",
  "TanStack/table": "tanstack/table",
  "upstash/skills": "upstash",
  "vercel-labs/agent-skills": "vercel",
  "vercel/next.js": "vercel",
}

const AGENTS_DIR = ".agents/skills"
const CLAUDE_DIR = ".claude/skills"

const lock: { skills?: Record<string, { source?: string }> } = JSON.parse(readFileSync("skills-lock.json", "utf8"))
const skills = lock.skills ?? {}

rmSync(AGENTS_DIR, { force: true, recursive: true })
rmSync(CLAUDE_DIR, { force: true, recursive: true })
rmSync("agent", { force: true, recursive: true })

const FIXED_PATH = "/usr/bin:/bin:/usr/sbin:/sbin"

const result = spawnSync(process.execPath, ["x", "--bun", "skills", "experimental_install"], {
  env: { ...process.env, PATH: FIXED_PATH },
  stdio: "inherit",
})

if (result.status !== 0) {
  console.error("✗ skills experimental_install failed")
  process.exit(result.status ?? 1)
}

const staging = join(AGENTS_DIR, ".staging")
mkdirSync(staging, { recursive: true })
for (const name of Object.keys(skills)) {
  if (existsSync(join(AGENTS_DIR, name))) {
    renameSync(join(AGENTS_DIR, name), join(staging, name))
  }
}

let grouped = 0
for (const [name, entry] of Object.entries(skills)) {
  const group = GROUPS[entry.source ?? ""]
  const staged = join(staging, name)

  if (!existsSync(staged)) {
    console.warn(`! ${name} was not restored by the skills CLI; run bunx skills add for it.`)
    continue
  }

  if (group === undefined) {
    console.warn(`! ${name} (${entry.source ?? "unknown source"}) has no group mapping; leaving it at the top level.`)
    renameSync(staged, join(AGENTS_DIR, name))
    continue
  }

  mkdirSync(join(AGENTS_DIR, group), { recursive: true })
  renameSync(staged, join(AGENTS_DIR, group, name))
  grouped += 1
}

rmSync(staging, { force: true, recursive: true })

mkdirSync(CLAUDE_DIR, { recursive: true })
const groupRoots = [...new Set(Object.values(GROUPS).map((group) => group.split("/")[0] ?? group))]
for (const root of groupRoots) {
  symlinkSync(`../../${AGENTS_DIR}/${root}`, join(CLAUDE_DIR, root))
}

console.log(`\n✓ Restored ${Object.keys(skills).length} skills, grouped ${grouped}, linked ${groupRoots.join(", ")} into ${CLAUDE_DIR}.`)
