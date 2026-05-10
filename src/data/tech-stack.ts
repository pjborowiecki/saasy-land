import { Box, CreditCard, Database, DatabaseBackup, Droplets, Layers, Mail, Server, ShieldCheck } from "lucide-react"

export const TECH_STACK = [
  { name: "Next.js", Icon: Box },
  { name: "Neon", Icon: Database },
  { name: "Stripe", Icon: CreditCard },
  { name: "Cloudflare Email Service", Icon: Mail },
  { name: "Drizzle", Icon: DatabaseBackup },
  { name: "Tailwind CSS", Icon: Droplets },
  { name: "shadcn/ui", Icon: Layers },
  { name: "Elysia", Icon: Server },
  { name: "Zod", Icon: ShieldCheck },
] as const
