import type { JSX, ReactNode } from "react"

import { type FeatureBundle, LazyMotion, MotionConfig } from "motion/react"

// Load Motion features after the initial render.
const loadFeatures = async (): Promise<FeatureBundle> => {
  const features = await import("~/src/presentation/components/custom/landing-page/constants/motion-features")
  return features.default
}

interface MotionProviderProps {
  readonly children: ReactNode
}

// Strict prevents accidental imports of the full motion component bundle.
export const MotionProvider = ({ children }: MotionProviderProps): JSX.Element => (
  <LazyMotion features={loadFeatures} strict>
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </LazyMotion>
)
