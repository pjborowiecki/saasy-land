import type { JSX, ReactNode } from "react"

import { type FeatureBundle, LazyMotion, MotionConfig } from "motion/react"

/**
 * Loaded after first render, never before.
 *
 * The hero is the LCP element and nothing in it is animated by Motion, so there is no reason for
 * a single byte of the animation runtime to compete with it. The dynamic import means the page
 * paints, and only then does the machinery for the interactions further down arrive.
 */
const loadFeatures = async (): Promise<FeatureBundle> => {
  const features = await import("~/src/presentation/components/custom/landing-page/constants/motion-features")
  return features.default
}

interface MotionProviderProps {
  readonly children: ReactNode
}

/**
 * Motion, scoped to the landing route group and configured to stay out of the way.
 *
 * `strict` is deliberate. It throws if anything imports the full `motion` component instead of
 * `m`, because one such import silently reinstates the 34kb bundle this whole arrangement exists
 * to avoid, and nothing about the page would look wrong while it happened.
 *
 * `reducedMotion="user"` makes every transform and layout animation below collapse to an instant
 * state change when the operating system asks for it, without a single check at a call site.
 * Opacity still crossfades, which is what the preference actually asks for: no travel, no spin,
 * no parallax — not a page that snaps.
 */
export const MotionProvider = ({ children }: MotionProviderProps): JSX.Element => (
  <LazyMotion features={loadFeatures} strict>
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </LazyMotion>
)
