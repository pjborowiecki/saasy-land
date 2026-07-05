import type { JSX } from "react"

import { DUMMY_POSTS } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-data"
import { BlogPostGridCard } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-grid-card"

export function BlogPostsGrid(): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {DUMMY_POSTS.map((post) => (
        <BlogPostGridCard key={post.id} post={post} />
      ))}
    </div>
  )
}
