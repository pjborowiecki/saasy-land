import { Box, CreditCard, Database, DatabaseBackup, Droplets, Layers, Mail, Server, ShieldCheck } from "lucide-react"

export const TECH_STACK = [
  { Icon: Box, name: "Next.js" },
  { Icon: Database, name: "Neon" },
  { Icon: CreditCard, name: "Stripe" },
  { Icon: Mail, name: "Resend" },
  { Icon: DatabaseBackup, name: "Drizzle" },
  { Icon: Droplets, name: "Tailwind CSS" },
  { Icon: Layers, name: "Shadcn/UI" },
  { Icon: Server, name: "Elysia" },
  { Icon: ShieldCheck, name: "Zod" },
] as const
