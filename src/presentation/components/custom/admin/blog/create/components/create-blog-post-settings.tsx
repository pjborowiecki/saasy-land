import type { JSX } from "react"

import { CreateBlogPostFeaturedImageSection } from "~/src/presentation/components/custom/admin/blog/create/components/create-blog-post-featured-image-section"
import { CreateBlogPostPublishingSection } from "~/src/presentation/components/custom/admin/blog/create/components/create-blog-post-publishing-section"

export const CreateBlogPostSettings = (): JSX.Element => (
  <div className="space-y-6 lg:col-span-1">
    <CreateBlogPostFeaturedImageSection />
    <CreateBlogPostPublishingSection />
  </div>
)
