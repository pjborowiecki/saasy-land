import type React from "react"

// The locale guard lives in the root layout; this segment stays synchronous so it
// never holds up the App Shell.
export default function BlogLayout({ children }: Readonly<LayoutProps<"/[locale]/blog">>): React.ReactNode {
  return children
}
