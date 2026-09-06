import { useFormatter, useTranslations } from "use-intl/react"

import { DUMMY_POSTS, type DummyPost } from "~/src/data/admin-blog"
export const useDemoPosts = (): DummyPost[] => {
  const t = useTranslations("pages.admin.blog.demo")
  const format = useFormatter()
  return DUMMY_POSTS.map((post) => ({
    author: post.author,
    category: t(`posts.${post.id}.category`),
    date:
      post.status === "published" ? format.dateTime(new Date(post.date), { day: "numeric", month: "short" }) : t(`dates.${post.status}`),
    description: t(`posts.${post.id}.description`),
    id: post.id,
    readTime: post.readTime,
    status: post.status,
    title: t(`posts.${post.id}.title`),
    views: post.views === undefined ? undefined : format.number(post.views, { maximumFractionDigits: 1, notation: "compact" }),
  }))
}
