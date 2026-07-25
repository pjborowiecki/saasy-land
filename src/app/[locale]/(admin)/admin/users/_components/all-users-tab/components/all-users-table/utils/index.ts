import { AVATAR_INITIALS_LENGTH } from "~/src/app/[locale]/(admin)/admin/_lib/constants"

const AVATAR_COLORS = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-fuchsia-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-sky-500",
] as const

export function initialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/u)
    .filter((part) => part.length > 0)
  const [first = "?", second] = parts

  if (second === undefined) {
    return first.slice(0, AVATAR_INITIALS_LENGTH).toUpperCase()
  }

  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
}

export function avatarGradientClassForId(id: string): string {
  let hash = 0
  for (const character of id) {
    hash = (hash + (character.codePointAt(0) ?? 0)) % AVATAR_COLORS.length
  }
  return AVATAR_COLORS[hash] ?? AVATAR_COLORS[0]
}
