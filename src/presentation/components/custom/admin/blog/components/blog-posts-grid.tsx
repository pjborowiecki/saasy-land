import type { JSX } from "react"

import { BlogPostGridCard } from "~/src/presentation/components/custom/admin/blog/components/blog-post-grid-card"
import { useDemoPosts } from "~/src/presentation/components/custom/admin/blog/hooks/use-demo-posts"

export const BlogPostsGrid = (): JSX.Element => {
  const posts = useDemoPosts()
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <BlogPostGridCard key={post.id} post={post} />
      ))}
    </div>
  )
}
