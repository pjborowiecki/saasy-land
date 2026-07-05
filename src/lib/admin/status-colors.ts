export type AdminStatusColor = "emerald" | "amber" | "rose" | "neutral"

const STATUS_BADGE_CLASSES: Record<AdminStatusColor, string> = {
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
  neutral: "border-border/50 bg-secondary/50 text-muted-foreground",
  rose: "border-rose-500/20 bg-rose-500/10 text-rose-500",
}

const STATUS_DOT_CLASSES: Record<AdminStatusColor, string> = {
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  neutral: "bg-muted-foreground",
  rose: "bg-rose-500",
}

export function getStatusBadgeClass(color: AdminStatusColor): string {
  return STATUS_BADGE_CLASSES[color]
}

export function getStatusDotClass(color: AdminStatusColor): string {
  return STATUS_DOT_CLASSES[color]
}

export type DashboardUserStatus = "Online" | "Idle" | "Offline"

export function getDashboardStatusDotClass(status: string): string {
  if (status === "Online") {
    return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
  }

  if (status === "Idle") {
    return "bg-amber-500"
  }

  return "bg-muted-foreground"
}

export type BlogPostStatus = "published" | "draft" | "scheduled"

export function getBlogPostStatusDotClass(status: BlogPostStatus): string {
  if (status === "published") {
    return "bg-emerald-500"
  }

  if (status === "draft") {
    return "bg-amber-500"
  }

  return "bg-blue-500"
}

export function getRoleTypeBadgeClass(typeColor: "default" | "fuchsia"): string {
  if (typeColor === "fuchsia") {
    return "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-500"
  }

  return "border-border/50 bg-secondary/50 text-muted-foreground"
}

export function getRoleIconClass(iconColor: "default" | "fuchsia"): string {
  if (iconColor === "fuchsia") {
    return "text-fuchsia-500"
  }

  return "text-muted-foreground"
}

export function getVisibilityBadgeClass(visibilityStatus: "public" | "hidden"): string {
  if (visibilityStatus === "public") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
  }

  return "border-muted/50 bg-secondary/50 text-muted-foreground"
}

export function getTagBadgeClass(color: string): string {
  if (color === "fuchsia") {
    return "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-500"
  }

  if (color === "blue") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-500"
  }

  if (color === "emerald") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
  }

  return "border-border/50 bg-secondary/50 text-muted-foreground"
}

export function getProductIconClass(iconColor: "default" | "fuchsia" | "emerald"): string {
  if (iconColor === "fuchsia") {
    return "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-500"
  }

  if (iconColor === "emerald") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
  }

  return "text-muted-foreground"
}
