"use client"

import { useCallback } from "react"

import confetti, { type Options } from "canvas-confetti"

interface FireConfig {
  particleRatio: number
  opts?: Partial<Options>
}

const DEFAULT_ORIGIN = { y: 0.7 }
const BASE_PARTICLE_COUNT = 200

const BURSTS: FireConfig[] = [
  { opts: { spread: 26, startVelocity: 55 }, particleRatio: 0.25 },
  { opts: { spread: 60 }, particleRatio: 0.2 },
  { opts: { decay: 0.91, scalar: 0.8, spread: 100 }, particleRatio: 0.35 },
  { opts: { decay: 0.92, scalar: 1.2, spread: 120, startVelocity: 25 }, particleRatio: 0.1 },
  { opts: { spread: 120, startVelocity: 45 }, particleRatio: 0.1 },
]

export function useConfetti(): { triggerConfetti: () => void } {
  const fire = useCallback((particleRatio: number, opts?: Partial<Options>) => {
    void confetti({
      origin: DEFAULT_ORIGIN,
      particleCount: Math.floor(BASE_PARTICLE_COUNT * particleRatio),
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
