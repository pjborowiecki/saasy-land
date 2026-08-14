import type { JSX } from "react"

import { BlogHeader } from "~/src/app/[locale]/(blog)/_components/blog-header"
import { Footer } from "~/src/app/[locale]/(landing)/_components/footer"
import { MotionProvider } from "~/src/app/[locale]/(landing)/_components/motion-provider"
import { PageFrame } from "~/src/app/[locale]/(landing)/_components/page-frame"

/**
 * The blog belongs to the site.
 *
 * It used to render as a bare white page: no frame, no bar, no footer, and — because nothing put
 * it inside `.dark` — a light theme in the middle of a product that is committed to one dark
 * ground. It read as a different website. The chrome, the measure and the vertical hairlines are
 * the landing page's, so an article looks like part of the same document.
 *
 * The locale guard lives in the root layout, so this segment stays synchronous and never holds up
 * the App Shell.
 */
export default function BlogLayout({ children }: Readonly<LayoutProps<"/[locale]/blog">>): JSX.Element {
  return (
    <div className="dark relative isolate min-h-svh bg-background text-foreground">
      <PageFrame />
      <MotionProvider>
        <BlogHeader />
        <main className="relative z-10">{children}</main>
        <Footer />
      </MotionProvider>
    </div>
  )
}
