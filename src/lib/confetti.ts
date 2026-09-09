import confetti from "canvas-confetti"

const BASE_PARTICLE_COUNT = 200
const DEFAULT_ORIGIN = { y: 0.7 }

const BURSTS = [
  { particleRatio: 0.25, spread: 26, startVelocity: 55 },
  { particleRatio: 0.2, spread: 60 },
  { decay: 0.91, particleRatio: 0.35, scalar: 0.8, spread: 100 },
  { decay: 0.92, particleRatio: 0.1, scalar: 1.2, spread: 120, startVelocity: 25 },
  { particleRatio: 0.1, spread: 120, startVelocity: 45 },
]

export const triggerConfetti = (): void => {
  for (const { particleRatio, ...options } of BURSTS) {
    void confetti({
      origin: DEFAULT_ORIGIN,
      particleCount: Math.floor(BASE_PARTICLE_COUNT * particleRatio),
      ...options,
    })
  }
}
