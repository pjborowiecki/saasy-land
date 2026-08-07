
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, symlinkSync } from "node:fs"
import { join } from "node:path"

const GROUPS: Record<string, string> = {
  "TanStack/table": "tanstack/table",
  "mattpocock/skills": "matt-pocock",
}

const AGENTS_DIR = ".agents/skills"
const CLAUDE_DIR = ".claude/skills"

const lock: { skills?: Record<string, { source?: string }> } = JSON.parse(readFileSync("skills-lock.json", "utf8"))
const skills = lock.skills ?? {}

rmSync(AGENTS_DIR, { force: true, recursive: true })
rmSync(CLAUDE_DIR, { force: true, recursive: true })
rmSync("agent", { force: true, recursive: true })

// The skills CLI runs through the exact Bun binary executing this script (no PATH
// lookup), without a shell, and with PATH pinned to fixed root-owned system
// directories so no user-writable entry can shadow a binary it spawns (e.g. git).
// `--bun` keeps the CLI itself on this runtime instead of resolving `node`.
const FIXED_PATH = "/usr/bin:/bin:/usr/sbin:/sbin"

const result = spawnSync(process.execPath, ["x", "--bun", "skills", "experimental_install"], {
  env: { ...process.env, PATH: FIXED_PATH },
  stdio: "inherit",
})

if (result.status !== 0) {
  console.error("✗ skills experimental_install failed")
  process.exit(result.status ?? 1)
}

let grouped = 0
for (const [name, entry] of Object.entries(skills)) {
  const group = GROUPS[entry.source ?? ""]
  const flat = join(AGENTS_DIR, name)

  if (group === undefined) {
    console.warn(`! ${name} (${entry.source ?? "unknown source"}) has no group mapping; leaving it at the top level.`)
    continue
  }

  if (!existsSync(flat)) {
    console.warn(`! ${name} was not restored by the skills CLI; run bunx skills add for it.`)
    continue
  }

  mkdirSync(join(AGENTS_DIR, group), { recursive: true })
  renameSync(flat, join(AGENTS_DIR, group, name))
  grouped += 1
}

mkdirSync(CLAUDE_DIR, { recursive: true })
const groupRoots = [...new Set(Object.values(GROUPS).map((group) => group.split("/")[0] ?? group))]
for (const root of groupRoots) {
  symlinkSync(`../../${AGENTS_DIR}/${root}`, join(CLAUDE_DIR, root))
}

console.log(`\n✓ Restored ${Object.keys(skills).length} skills, grouped ${grouped}, linked ${groupRoots.join(", ")} into ${CLAUDE_DIR}.`)
