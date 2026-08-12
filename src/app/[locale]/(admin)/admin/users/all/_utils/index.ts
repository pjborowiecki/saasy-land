import { AVATAR_INITIALS_LENGTH } from "~/src/app/[locale]/(admin)/admin/_lib/constants"

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
