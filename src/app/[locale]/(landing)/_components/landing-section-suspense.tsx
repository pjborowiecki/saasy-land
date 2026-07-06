import { type JSX, Suspense, type ReactNode } from "react"

import { SectionSkeleton } from "~/src/app/[locale]/(landing)/_components/section-skeleton"

const sectionSuspenseFallback = <SectionSkeleton />

export function LandingSectionSuspense({ children }: { children: ReactNode }): JSX.Element {
  return <Suspense fallback={sectionSuspenseFallback}>{children}</Suspense>
}
