import type {
  AdminAnalyticsRegionRow,
  AdminAnalyticsUpgradeRow,
  AdminCategoryRow,
  AdminInvitationRow,
  AdminPaymentRow,
  AdminRoleRow,
  AdminSecuritySessionRow,
  AdminUserRow,
  DashboardSessionItem,
  DashboardUserRow,
} from "~/src/app/[locale]/(admin)/admin/_types"

const ADDITIONAL_ADMIN_USER_COUNT = 25
const ADDITIONAL_ADMIN_USER_START_ID = 6
const ADMIN_USER_AVATAR_EVERY_N = 3
const ASCII_UPPERCASE_A = 65
const ALPHABET_LENGTH = 26
const ADMIN_USER_NAME_OFFSET = 7

function createAdditionalAdminUserRows(): AdminUserRow[] {
  const roles = ["Administrator", "Editor", "Viewer", "Subscriber"] as const
  const statusVariants: {
    isBanned?: boolean
    lastActive: string
    status: string
    statusColor: AdminUserRow["statusColor"]
  }[] = [
    { lastActive: "Just now", status: "Active", statusColor: "emerald" },
    { lastActive: "15 mins ago", status: "Active", statusColor: "emerald" },
    { lastActive: "3 hours ago", status: "Active", statusColor: "emerald" },
    { lastActive: "Yesterday", status: "Pending", statusColor: "amber" },
    { isBanned: true, lastActive: "Sep 4, 2024", status: "Banned", statusColor: "rose" },
  ]
  const colorVariants = [
    "from-cyan-600 to-blue-400",
    "from-emerald-600 to-teal-400",
    "from-amber-600 to-yellow-400",
    "from-violet-600 to-purple-400",
    "from-slate-600 to-zinc-400",
  ] as const

  return Array.from({ length: ADDITIONAL_ADMIN_USER_COUNT }, (_, index) => {
    const id = String(index + ADDITIONAL_ADMIN_USER_START_ID)
    const variant = statusVariants[index % statusVariants.length]!
    const role = roles[index % roles.length]!
    const letterA = String.fromCodePoint(ASCII_UPPERCASE_A + (index % ALPHABET_LENGTH))
    const letterB = String.fromCodePoint(ASCII_UPPERCASE_A + ((index + ADMIN_USER_NAME_OFFSET) % ALPHABET_LENGTH))
    const row: AdminUserRow = {
      email: `user.${id}@example.com`,
      id: `u${id}`,
      lastActive: variant.lastActive,
      name: `Demo User ${letterA}${letterB}${id}`,
      role,
      status: variant.status,
      statusColor: variant.statusColor,
    }

    if (variant.isBanned === true) {
      row.isBanned = true
    }

    if (index % ADMIN_USER_AVATAR_EVERY_N === 0) {
      row.avatar = `https://i.pravatar.cc/150?u=admin-user-${id}`
    } else {
      const color = colorVariants[index % colorVariants.length]!
      row.colors = color
      row.initials = `${letterA}${letterB}`
    }

    return row
  })
}

export const DASHBOARD_CHART_Y_AXIS = ["$30k", "$20k", "$10k", "$0"] as const

export const DASHBOARD_CHART_X_AXIS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const

export const DASHBOARD_USER_ROWS: DashboardUserRow[] = [
  {
    avatar: "https://i.pravatar.cc/150?u=1",
    email: "sarah@example.com",
    id: 1,
    lastActive: "Just now",
    name: "Sarah Jenkins",
    role: "Admin",
    status: "Online",
  },
  {
    email: "michael@example.com",
    id: 2,
    initials: "MR",
    lastActive: "2 hours ago",
    name: "Michael Ross",
    role: "Editor",
    status: "Offline",
  },
  {
    avatar: "https://i.pravatar.cc/150?u=4",
    email: "elena@example.com",
    id: 3,
    lastActive: "15 mins ago",
    name: "Elena Smith",
    role: "Viewer",
    status: "Idle",
  },
]

export const DASHBOARD_SESSION_ITEMS: DashboardSessionItem[] = [
  {
    device: "Mac OS • Safari",
    icon: "laptop",
    id: 1,
    isCurrent: true,
    location: "New York, US • IP: 192.168.1.1",
  },
  {
    device: "iOS • Chrome",
    icon: "smartphone",
    id: 2,
    isCurrent: false,
    location: "London, UK • 2 hours ago",
  },
]

export const ADMIN_USER_ROWS: AdminUserRow[] = [
  {
    colors: "from-blue-600 to-indigo-400",
    email: "alice.smith@example.com",
    id: "u1",
    initials: "AS",
    lastActive: "Just now",
    name: "Alice Smith",
    role: "Administrator",
    status: "Active",
    statusColor: "emerald",
  },
  {
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "m.johnson@example.com",
    id: "u2",
    lastActive: "2 hours ago",
    name: "Michael Johnson",
    role: "Editor",
    status: "Active",
    statusColor: "emerald",
  },
  {
    colors: "from-rose-600 to-orange-400",
    email: "emma.r@example.com",
    id: "u3",
    initials: "ER",
    lastActive: "Never",
    name: "Emma Richards",
    role: "Viewer",
    status: "Pending",
    statusColor: "amber",
  },
  {
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "david.lee@example.com",
    id: "u4",
    isBanned: true,
    lastActive: "Oct 12, 2023",
    name: "David Lee",
    role: "Subscriber",
    status: "Banned",
    statusColor: "rose",
  },
  {
    colors: "from-purple-600 to-fuchsia-400",
    email: "s.kline@example.com",
    id: "u5",
    initials: "SK",
    lastActive: "1 day ago",
    name: "Sarah Kline",
    role: "Editor",
    status: "Active",
    statusColor: "emerald",
  },
  ...createAdditionalAdminUserRows(),
]

export const ADMIN_INVITATION_ROWS: AdminInvitationRow[] = [
  {
    email: "alex.chen@example.com",
    id: "i1",
    invitedBy: "John Doe",
    role: "Administrator",
    sentDate: "2 hours ago",
    status: "Pending",
    statusColor: "amber",
  },
  {
    email: "m.roberts@startup.io",
    id: "i2",
    invitedBy: "John Doe",
    role: "Viewer",
    sentDate: "Yesterday",
    status: "Pending",
    statusColor: "amber",
  },
  {
    email: "k.williams@acme.co",
    id: "i3",
    invitedBy: "Sarah Kline",
    role: "Editor",
    sentDate: "Oct 10, 2023",
    status: "Expired",
    statusColor: "rose",
  },
  {
    email: "j.miller@example.com",
    id: "i4",
    invitedBy: "John Doe",
    role: "Subscriber",
    sentDate: "Oct 20, 2023",
    status: "Pending",
    statusColor: "amber",
  },
  {
    email: "s.taylor@designco.com",
    id: "i5",
    invitedBy: "John Doe",
    role: "Editor",
    sentDate: "Sep 28, 2023",
    status: "Expired",
    statusColor: "rose",
  },
]

export const ADMIN_ROLE_ROWS: AdminRoleRow[] = [
  {
    description: "Full access to all system features, billing, and settings.",
    icon: "Shield",
    iconColor: "default",
    id: "r1",
    name: "Administrator",
    type: "System",
    typeColor: "default",
    usersCount: "3 users",
  },
  {
    description: "Can edit products and content, but cannot manage users.",
    icon: "Pen",
    iconColor: "default",
    id: "r2",
    name: "Editor",
    type: "System",
    typeColor: "default",
    usersCount: "12 users",
  },
  {
    description: "Access to user sessions and basic troubleshooting tools.",
    icon: "HelpCircle",
    iconColor: "fuchsia",
    id: "r3",
    name: "Support Agent",
    type: "Custom",
    typeColor: "fuchsia",
    usersCount: "5 users",
  },
  {
    description: "Read-only access to analytics and dashboards.",
    icon: "Eye",
    iconColor: "default",
    id: "r4",
    name: "Viewer",
    type: "System",
    typeColor: "default",
    usersCount: "28 users",
  },
  {
    description: "Access to developer settings, API keys, and webhooks.",
    icon: "Code",
    iconColor: "fuchsia",
    id: "r5",
    name: "API Developer",
    type: "Custom",
    typeColor: "fuchsia",
    usersCount: "2 users",
  },
]

export const ADMIN_CATEGORY_ROWS: AdminCategoryRow[] = [
  {
    description: "Core subscription tiers for standard users",
    icon: "FolderOpen",
    id: "cat-1",
    items: "12",
    lastUpdated: "Oct 24, 2023",
    name: "SaaS Plans",
    visibility: "Public",
    visibilityStatus: "public",
  },
  {
    description: "One-time extensions and API limits",
    icon: "Puzzle",
    id: "cat-2",
    items: "8",
    lastUpdated: "Sep 12, 2023",
    name: "Add-ons & Extras",
    visibility: "Public",
    visibilityStatus: "public",
  },
  {
    description: "Grandfathered plans no longer available for purchase",
    icon: "Archive",
    id: "cat-3",
    items: "3",
    lastUpdated: "Jan 05, 2023",
    name: "Legacy Plans",
    visibility: "Hidden",
    visibilityStatus: "hidden",
  },
]

export const ADMIN_COLLECTION_ROWS: AdminCategoryRow[] = [
  {
    description: "Core subscription tiers for standard users",
    icon: "FolderOpen",
    id: "col-1",
    items: "12",
    lastUpdated: "Oct 24, 2023",
    name: "SaaS Plans",
    visibility: "Public",
    visibilityStatus: "public",
  },
  {
    description: "One-time extensions and API limits",
    icon: "Puzzle",
    id: "col-2",
    items: "8",
    lastUpdated: "Sep 12, 2023",
    name: "Add-ons & Extras",
    visibility: "Public",
    visibilityStatus: "public",
  },
  {
    description: "Grandfathered plans no longer available for purchase",
    icon: "Archive",
    id: "col-3",
    items: "3",
    lastUpdated: "Jan 05, 2023",
    name: "Legacy Plans",
    visibility: "Hidden",
    visibilityStatus: "hidden",
  },
]

export const ADMIN_PAYMENT_ROWS: AdminPaymentRow[] = [
  {
    amount: "$199.00",
    date: "Nov 25, 2024",
    email: "alex@example.com",
    id: 1,
    initials: "AJ",
    item: "Pro Annual",
    name: "Alex Johnson",
    reason: "Accidental renewal",
    status: "Processed",
    statusColor: "bg-emerald-500",
    statusTextColor: "text-muted-foreground",
    type: "Full refund",
  },
  {
    amount: "$9.50",
    date: "Nov 22, 2024",
    email: "sarah.s@domain.com",
    id: 2,
    initials: "SS",
    item: "Pro Monthly",
    name: "Sarah Smith",
    reason: "Downtime compensation",
    status: "Processed",
    statusColor: "bg-emerald-500",
    statusTextColor: "text-muted-foreground",
    type: "Partial refund",
  },
  {
    amount: "$9.00",
    date: "Nov 20, 2024",
    email: "mike.b@startup.io",
    id: 3,
    initials: "MB",
    item: "Starter Monthly",
    name: "Michael Brown",
    reason: "Not a fit",
    status: "Pending",
    statusColor: "bg-amber-500",
    statusTextColor: "text-amber-500 dark:text-amber-400",
    type: "Full refund",
  },
  {
    amount: "$199.00",
    date: "Nov 18, 2024",
    email: "emma@design.co",
    id: 4,
    initials: "ED",
    item: "Pro Annual",
    name: "Emma Davis",
    reason: "Fraudulent charge",
    status: "Failed",
    statusColor: "bg-rose-500",
    statusTextColor: "text-rose-500 dark:text-rose-400",
    type: "Full refund",
  },
]

export const ADMIN_ANALYTICS_REGION_ROWS: AdminAnalyticsRegionRow[] = [
  { flag: "🇺🇸", name: "United States", percentage: 45 },
  { flag: "🇬🇧", name: "United Kingdom", percentage: 22 },
  { flag: "🇨🇦", name: "Canada", percentage: 15 },
  { flag: "🇩🇪", name: "Germany", percentage: 8 },
  { flag: "🇦🇺", name: "Australia", percentage: 10 },
]

export const ADMIN_ANALYTICS_UPGRADE_ROWS: AdminAnalyticsUpgradeRow[] = [
  {
    action: "Upgraded to Pro Plan",
    colors: "from-blue-600 to-indigo-400",
    initials: "AS",
    name: "Alice Smith",
    time: "2 mins ago",
  },
  {
    action: "Upgraded to Enterprise",
    colors: "from-emerald-600 to-teal-400",
    initials: "MJ",
    name: "Michael Johnson",
    time: "1 hour ago",
  },
  {
    action: "Upgraded to Pro Plan",
    colors: "from-rose-600 to-orange-400",
    initials: "ER",
    name: "Emma Richards",
    time: "3 hours ago",
  },
  {
    action: "Upgraded to Team Plan",
    colors: "border border-border/50 bg-secondary text-muted-foreground",
    initials: "DL",
    name: "David Lee",
    time: "5 hours ago",
  },
  {
    action: "Upgraded to Pro Plan",
    colors: "from-purple-600 to-fuchsia-400",
    initials: "SK",
    name: "Sarah Kline",
    time: "1 day ago",
  },
]

export const ADMIN_SECURITY_SESSION_ROWS: AdminSecuritySessionRow[] = [
  {
    device: "Mac OS Safari",
    icon: "laptop",
    ip: "192.168.1.1",
    isCurrent: true,
    location: "New York, USA",
  },
  {
    device: "iOS Chrome",
    icon: "smartphone",
    isCurrent: false,
    location: "London, UK",
    time: "2 hours",
  },
]
