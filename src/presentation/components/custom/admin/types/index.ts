export type StatusColor = "amber" | "emerald" | "rose"

export type RoleIcon = "Code" | "Eye" | "HelpCircle" | "Pen" | "Shield"

export type RoleBadgeColor = "default" | "fuchsia"

export interface DashboardUserRow {
  avatar?: string
  email: string
  id: string
  initials?: string
  lastActive: string
  name: string
  role: string
  status: string
}

export interface AdminInvitationRow {
  email: string
  id: string
  invitedBy: string
  role: string
  sentDate: string
  status: string
  statusColor: StatusColor
}

export interface AdminRoleRow {
  description: string
  icon: RoleIcon
  iconColor: RoleBadgeColor
  id: string
  name: string
  type: string
  typeColor: RoleBadgeColor
  usersCount: string
}

export interface AdminPaymentRow {
  amount: string
  date: string
  email: string
  id: number
  initials: string
  item: string
  name: string
  reason: string
  status: string
  statusColor: string
  statusTextColor: string
  type: string
}

export interface AdminAnalyticsRegionRow {
  flag: string
  name: string
  percentage: number
}

export interface AdminAnalyticsUpgradeRow {
  action: string
  colors: string
  initials: string
  name: string
  time: string
}
