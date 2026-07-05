import type { JSX } from "react"

import { CreateBlogPostFeaturedImageSection } from "~/src/app/[locale]/(admin)/admin/blog/create/_components/create-blog-post-featured-image-section"
import { CreateBlogPostPublishingSection } from "~/src/app/[locale]/(admin)/admin/blog/create/_components/create-blog-post-publishing-section"

export function CreateBlogPostSettings(): JSX.Element {
  return (
    <div className="space-y-6 lg:col-span-1">
      <CreateBlogPostFeaturedImageSection />
      <CreateBlogPostPublishingSection />
    </div>
  )
}
