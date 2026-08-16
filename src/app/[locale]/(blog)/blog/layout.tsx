import type { JSX } from "react"

import { BlogHeader } from "~/src/app/[locale]/(blog)/_components/blog-header"
import { Footer } from "~/src/app/[locale]/(landing)/_components/footer/footer"
import { MotionProvider } from "~/src/app/[locale]/(landing)/_components/shared/motion-provider"
import { PageFrame } from "~/src/app/[locale]/(landing)/_components/shared/page-frame"

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
