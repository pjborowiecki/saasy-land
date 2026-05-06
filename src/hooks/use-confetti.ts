"use client"

import { useCallback } from "react"

import confetti, { type Options } from "canvas-confetti"

interface FireConfig {
  particleRatio: number
  opts?: Partial<Options>
}

const DEFAULT_ORIGIN = { y: 0.7 }

const BURSTS: FireConfig[] = [
  { particleRatio: 0.25, opts: { spread: 26, startVelocity: 55 } },
  { particleRatio: 0.2, opts: { spread: 60 } },
  { particleRatio: 0.35, opts: { spread: 100, decay: 0.91, scalar: 0.8 } },
  { particleRatio: 0.1, opts: { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 } },
  { particleRatio: 0.1, opts: { spread: 120, startVelocity: 45 } },
]

export function useConfetti(): { triggerConfetti: () => void } {
  const fire = useCallback((particleRatio: number, opts?: Partial<Options>) => {
    confetti({
      origin: DEFAULT_ORIGIN,
      particleCount: Math.floor(200 * particleRatio),
      ...opts,
    })
  }, [])

  const triggerConfetti = useCallback(() => {
    for (const { particleRatio, opts } of BURSTS) {
      fire(particleRatio, opts)
    }
  }, [fire])

  return { triggerConfetti }
}
