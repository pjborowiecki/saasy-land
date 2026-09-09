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

export const getVisibilityBadgeClass = (visibilityStatus: "public" | "hidden"): string =>
  visibilityStatus === "public" ? STATUS_BADGE_CLASSES.emerald : STATUS_BADGE_CLASSES.neutral

export const getVisibilityMarkClass = (visibilityStatus: "public" | "hidden"): string =>
  visibilityStatus === "public" ? STATUS_DOT_CLASSES.emerald : STATUS_DOT_CLASSES.neutral
