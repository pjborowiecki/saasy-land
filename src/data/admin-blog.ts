export interface DummyPost {
  author: { initials: string; name: string }
  category: string
  date: string
  description: string
  id: string
  readTime: number | undefined
  status: "published" | "draft" | "scheduled"
  title: string
  views: string | undefined
}

export const DEMO_BLOG_STATS = {
  draftsPending: 12,
  publishedPosts: 142,
  subscribers: 8409,
  subscribersGrowth: 0.042,
  totalViews: 45_200,
  viewsGrowth: 0.125,
} as const

export const DUMMY_POSTS = [
  {
    author: {
      initials: "MK",
      name: "Marta Kowalczyk",
    },
    date: "2024-10-24T00:00:00.000Z",
    id: "post-1",
    readTime: 8,
    status: "published",
    views: 12_400,
  },
  {
    author: {
      initials: "DO",
      name: "Dele Okonkwo",
    },
    date: "",
    id: "post-2",
    readTime: undefined,
    status: "draft",
    views: undefined,
  },
  {
    author: {
      initials: "HN",
      name: "Hana Nakamura",
    },
    date: "2024-10-18T00:00:00.000Z",
    id: "post-3",
    readTime: 6,
    status: "published",
    views: 8100,
  },
  {
    author: {
      initials: "MK",
      name: "Marta Kowalczyk",
    },
    date: "",
    id: "post-4",
    readTime: undefined,
    status: "scheduled",
    views: undefined,
  },
  {
    author: {
      initials: "RS",
      name: "Rafael Santos",
    },
    date: "2024-10-12T00:00:00.000Z",
    id: "post-5",
    readTime: 12,
    status: "published",
    views: 5600,
  },
  {
    author: {
      initials: "DO",
      name: "Dele Okonkwo",
    },
    date: "2024-10-05T00:00:00.000Z",
    id: "post-6",
    readTime: 5,
    status: "published",
    views: 22_100,
  },
] as const
