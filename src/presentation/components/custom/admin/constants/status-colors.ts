/*
 * STATUS COLOUR — three meanings, and nothing decorative.
 *
 * This file used to hand out emerald, amber, rose, fuchsia and blue, which put five hues on a
 * console whose palette has one. Worse, the hue was carrying identity rather than meaning: a
 * fuchsia badge for "role type" and a blue one for "scheduled" say nothing a reader can decode.
 *
 * There are now exactly three states a colour is allowed to express, and every one of them is
 * something the operator has to act on:
 *
 *   positive   the accent (`--ring`). Live, verified, published, public. The same cyan the
 *              marketing site spends on verified facts, which is deliberate: in both surfaces
 *              it means "this is true right now".
 *   attention  a desaturated amber. Waiting on somebody. Not an error.
 *   negative   `--destructive`. Banned, failed, refunded.
 *
 * Everything else is `neutral`, which is the hairline and the muted foreground, because most
 * states are not worth a colour.
 *
 * Badges are hairline pills with a low-alpha wash, never a saturated fill: a filled badge on a
 * dark console is a light source, and a table of them reads as a christmas tree.
 */

export type AdminStatusColor = "emerald" | "amber" | "rose" | "neutral"

const STATUS_BADGE_CLASSES: Record<AdminStatusColor, string> = {
  amber: "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  emerald: "border-ring/30 bg-ring/10 text-ring",
  neutral: "border-border bg-muted text-muted-foreground",
  rose: "border-destructive/25 bg-destructive/10 text-destructive",
}

const STATUS_DOT_CLASSES: Record<AdminStatusColor, string> = {
  amber: "bg-amber-500",
  emerald: "bg-ring",
  neutral: "bg-muted-foreground/60",
  rose: "bg-destructive",
}

export const getStatusBadgeClass = (color: AdminStatusColor): string => STATUS_BADGE_CLASSES[color]

export const getStatusDotClass = (color: AdminStatusColor): string => STATUS_DOT_CLASSES[color]

export type DashboardUserStatus = "Online" | "Idle" | "Offline" | "active" | "pending" | "banned"

/** No glow. A 2px dot with a blur behind it is a LED, and this is a status, not a device. */
export const getDashboardStatusDotClass = (status: string): string => {
  if (status === "active" || status === "Active" || status === "Online") {
    return STATUS_DOT_CLASSES.emerald
  }

  if (status === "pending" || status === "Pending" || status === "Idle") {
    return STATUS_DOT_CLASSES.amber
  }

  if (status === "banned" || status === "Banned") {
    return STATUS_DOT_CLASSES.rose
  }

  return STATUS_DOT_CLASSES.neutral
}

export type BlogPostStatus = "published" | "draft" | "scheduled"

export const getBlogPostStatusDotClass = (status: BlogPostStatus): string => {
  if (status === "published") {
    return STATUS_DOT_CLASSES.emerald
  }

  if (status === "scheduled") {
    return STATUS_DOT_CLASSES.amber
  }

  return STATUS_DOT_CLASSES.neutral
}

export const getBlogPostStatusBadgeClass = (status: BlogPostStatus): string => {
  if (status === "published") {
    return STATUS_BADGE_CLASSES.emerald
  }

  if (status === "scheduled") {
    return STATUS_BADGE_CLASSES.amber
  }

  return STATUS_BADGE_CLASSES.neutral
}

/**
 * Role and tag colours are gone. A role is not a state, so it gets the neutral badge and the
 * reader gets to spend their attention on the states that are.
 */
export const getRoleTypeBadgeClass = (): string => STATUS_BADGE_CLASSES.neutral

export const getRoleIconClass = (): string => "text-muted-foreground"

export const getTagBadgeClass = (): string => STATUS_BADGE_CLASSES.neutral

export const getProductIconClass = (): string => "text-muted-foreground"

export const getVisibilityBadgeClass = (visibilityStatus: "public" | "hidden"): string =>
  visibilityStatus === "public" ? STATUS_BADGE_CLASSES.emerald : STATUS_BADGE_CLASSES.neutral

export const getVisibilityMarkClass = (visibilityStatus: "public" | "hidden"): string =>
  visibilityStatus === "public" ? STATUS_DOT_CLASSES.emerald : STATUS_DOT_CLASSES.neutral
