import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, symlinkSync } from "node:fs"
import { join } from "node:path"

const GROUPS: Record<string, string> = {
  "anthropics/skills": "anthropic",
  "better-auth/skills": "better-auth",
  "cloudflare/skills": "cloudflare",
  "coreyhaines31/marketingskills": "coreyhaines31",
  "Leonxlnx/taste-skill": "taste",
  "mattpocock/skills": "matt-pocock",
  "pbakaus/impeccable": "impeccable",
  "polarsource/skills": "polar",
  "remotion-dev/skills": "remotion",
  "resend/resend-skills": "resend",
  "TanStack/router": "tanstack/router",
  "TanStack/table": "tanstack/table",
}

const START_PACKAGE = /^packages\/(?:react-start|start-[^/]+)\//

const resolveGroup = (entry: { source?: string; skillPath?: string }): string | undefined => {
  if (entry.source === "TanStack/router" && START_PACKAGE.test(entry.skillPath ?? "")) {
    return "tanstack/start"
  }

  return GROUPS[entry.source ?? ""]
}

const AGENTS_DIR = ".agents/skills"
const CLAUDE_DIR = ".claude/skills"

const lock: { skills?: Record<string, { source?: string; skillPath?: string }> } = JSON.parse(readFileSync("skills-lock.json", "utf8"))
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
const roots = new Set<string>()
const ungrouped: string[] = []
for (const [name, entry] of Object.entries(skills)) {
  const group = resolveGroup(entry)
  const staged = join(staging, name)

  if (!existsSync(staged)) {
    console.warn(`! ${name} was not restored by the skills CLI; run bunx skills add for it.`)
    continue
  }

  if (group === undefined) {
    console.warn(`! ${name} (${entry.source ?? "unknown source"}) has no group mapping; leaving it at the top level.`)
    renameSync(staged, join(AGENTS_DIR, name))
    ungrouped.push(entry.source ?? "unknown source")
    continue
  }

  mkdirSync(join(AGENTS_DIR, group), { recursive: true })
  renameSync(staged, join(AGENTS_DIR, group, name))
  roots.add(group.split("/")[0] ?? group)
  grouped += 1
}

rmSync(staging, { force: true, recursive: true })

mkdirSync(CLAUDE_DIR, { recursive: true })
const groupRoots = [...roots].sort((a, b) => a.localeCompare(b))
for (const root of groupRoots) {
  symlinkSync(`../../${AGENTS_DIR}/${root}`, join(CLAUDE_DIR, root))
}

console.log(`\n✓ Restored ${Object.keys(skills).length} skills, grouped ${grouped}, linked ${groupRoots.join(", ")} into ${CLAUDE_DIR}.`)

if (ungrouped.length > 0) {
  const sources = [...new Set(ungrouped)].sort((a, b) => a.localeCompare(b)).join(", ")
  console.error(`\n✗ ${ungrouped.length} skills stayed at the top level. Add these sources to GROUPS: ${sources}`)
  process.exit(1)
}
