import type { BlogPostStatus } from "~/src/lib/admin/status-colors"

export interface DummyPost {
  author: { initials: string; name: string }
  category: string
  categoryColor: string
  date: string
  description: string
  id: string
  readTime: number | undefined
  status: BlogPostStatus
  title: string
  views: string | undefined
}

export const DUMMY_POSTS: DummyPost[] = [
  {
    author: { initials: "JD", name: "John Doe" },
    category: "Engineering",
    categoryColor: "indigo",
    date: "Oct 24",
    description:
      "An in-depth technical dive into how our engineering team transitioned from a monolithic setup to a distributed architecture.",
    id: "post-1",
    readTime: 8,
    status: "published",
    title: "Scaling Database Architecture for 10x Growth",
    views: "12.4k",
  },
  {
    author: { initials: "SM", name: "Sarah Miller" },
    category: "Product Update",
    categoryColor: "emerald",
    date: "2h ago",
    description:
      "We've completely overhauled our reporting tools to give you deeper insights into your customer behavior and revenue metrics.",
    id: "post-2",
    readTime: undefined,
    status: "draft",
    title: "Introducing Advanced Analytics Dashboard 2.0",
    views: undefined,
  },
  {
    author: { initials: "AL", name: "Alex Lee" },
    category: "Design",
    categoryColor: "rose",
    date: "Oct 18",
    description: "Building a cohesive visual language that scales across web, mobile, and internal administrative tools.",
    id: "post-3",
    readTime: 6,
    status: "published",
    title: "The Evolution of our Design System",
    views: "8.1k",
  },
  {
    author: { initials: "JD", name: "John Doe" },
    category: "Company News",
    categoryColor: "blue",
    date: "Tomorrow",
    description: "We are thrilled to announce a $25M investment led by top tier venture firms to accelerate our growth.",
    id: "post-4",
    readTime: undefined,
    status: "scheduled",
    title: "Announcing our Series B Funding Round",
    views: undefined,
  },
  {
    author: { initials: "TW", name: "Tom Wilson" },
    category: "Tutorial",
    categoryColor: "fuchsia",
    date: "Oct 12",
    description: "Learn how to build resilient webhook systems that handle millions of events securely.",
    id: "post-5",
    readTime: 12,
    status: "published",
    title: "Mastering Webhooks for Real-time Data",
    views: "5.6k",
  },
  {
    author: { initials: "SM", name: "Sarah Miller" },
    category: "Marketing",
    categoryColor: "amber",
    date: "Oct 05",
    description: "Proven retention tactics used by the fastest-growing SaaS companies.",
    id: "post-6",
    readTime: 5,
    status: "published",
    title: "Strategies for Reducing Customer Churn",
    views: "22.1k",
  },
]
