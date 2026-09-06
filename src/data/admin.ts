export const ADMIN_ANALYTICS_REGION_ROWS = [
  {
    code: "US",
    flag: "🇺🇸",
    percentage: 45,
  },
  {
    code: "GB",
    flag: "🇬🇧",
    percentage: 22,
  },
  {
    code: "CA",
    flag: "🇨🇦",
    percentage: 15,
  },
  {
    code: "DE",
    flag: "🇩🇪",
    percentage: 8,
  },
  {
    code: "AU",
    flag: "🇦🇺",
    percentage: 10,
  },
] as const

export const ADMIN_ANALYTICS_UPGRADE_ROWS = [
  {
    colors: "from-blue-600 to-indigo-400",
    id: "u1",
    initials: "AS",
    name: "Alice Smith",
  },
  {
    colors: "from-emerald-600 to-teal-400",
    id: "u2",
    initials: "MJ",
    name: "Michael Johnson",
  },
  {
    colors: "from-rose-600 to-orange-400",
    id: "u3",
    initials: "ER",
    name: "Emma Richards",
  },
  {
    colors: "border border-border/50 bg-secondary text-muted-foreground",
    id: "u4",
    initials: "DL",
    name: "David Lee",
  },
  {
    colors: "from-purple-600 to-fuchsia-400",
    id: "u5",
    initials: "SK",
    name: "Sarah Kline",
  },
] as const

export const ADMIN_INVITATION_ROWS = [
  {
    email: "alex.chen@example.com",
    id: "i1",
    invitedBy: "Marta Kowalczyk",
    statusColor: "amber",
  },
  {
    email: "m.roberts@startup.io",
    id: "i2",
    invitedBy: "Marta Kowalczyk",
    statusColor: "amber",
  },
  {
    email: "k.williams@acme.co",
    id: "i3",
    invitedBy: "Sarah Kline",
    statusColor: "rose",
  },
  {
    email: "j.miller@example.com",
    id: "i4",
    invitedBy: "Marta Kowalczyk",
    statusColor: "amber",
  },
  {
    email: "s.taylor@designco.com",
    id: "i5",
    invitedBy: "Marta Kowalczyk",
    statusColor: "rose",
  },
] as const

export const ADMIN_PAYMENT_ROWS = [
  {
    amount: 199,
    date: "2024-11-25T00:00:00.000Z",
    email: "alex@example.com",
    id: 1,
    initials: "AJ",
    name: "Alex Johnson",
    statusColor: "bg-emerald-500",
    statusTextColor: "text-muted-foreground",
  },
  {
    amount: 9.5,
    date: "2024-11-22T00:00:00.000Z",
    email: "sarah.s@domain.com",
    id: 2,
    initials: "SS",
    name: "Sarah Smith",
    statusColor: "bg-emerald-500",
    statusTextColor: "text-muted-foreground",
  },
  {
    amount: 9,
    date: "2024-11-20T00:00:00.000Z",
    email: "mike.b@startup.io",
    id: 3,
    initials: "MB",
    name: "Michael Brown",
    statusColor: "bg-amber-500",
    statusTextColor: "text-amber-500 dark:text-amber-400",
  },
  {
    amount: 199,
    date: "2024-11-18T00:00:00.000Z",
    email: "emma@design.co",
    id: 4,
    initials: "ED",
    name: "Emma Davis",
    statusColor: "bg-rose-500",
    statusTextColor: "text-rose-500 dark:text-rose-400",
  },
] as const

export const ADMIN_ROLE_ROWS = [
  {
    icon: "Shield",
    iconColor: "default",
    id: "r1",
    typeColor: "default",
    usersCount: 3,
  },
  {
    icon: "Pen",
    iconColor: "default",
    id: "r2",
    typeColor: "default",
    usersCount: 12,
  },
  {
    icon: "HelpCircle",
    iconColor: "fuchsia",
    id: "r3",
    typeColor: "fuchsia",
    usersCount: 5,
  },
  {
    icon: "Eye",
    iconColor: "default",
    id: "r4",
    typeColor: "default",
    usersCount: 28,
  },
  {
    icon: "Code",
    iconColor: "fuchsia",
    id: "r5",
    typeColor: "fuchsia",
    usersCount: 2,
  },
] as const
