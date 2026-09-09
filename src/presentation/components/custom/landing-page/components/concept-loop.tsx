import { type JSX, useEffect, useRef } from "react"

import { cn } from "~/src/lib/cn"

const play = async (video: HTMLVideoElement, offsetSeconds: number): Promise<void> => {
  try {
    if (offsetSeconds > 0 && video.currentTime === 0) {
      video.currentTime = offsetSeconds
    }
    await video.play()
  } catch {}
}

interface ConceptLoopProps {
  readonly className?: string
  readonly label?: string
  readonly name: string
  readonly offsetSeconds?: number
}

export const ConceptLoop = ({ className, label, name, offsetSeconds = 0 }: ConceptLoopProps): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    if (globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting !== true) {
          video.pause()
          return
        }
        void play(video, offsetSeconds)
      },
      { threshold: 0.25 },
    )
    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [offsetSeconds])

  return (
    <video
      ref={videoRef}
      aria-hidden={label === undefined ? true : undefined}
      aria-label={label}
      className={cn("block h-auto w-full", className)}
      disablePictureInPicture
      loop
      muted
      playsInline
      poster={`/motion/${name}.webp`}
      preload="none"
      role={label === undefined ? undefined : "img"}
      tabIndex={-1}
    >
      <source src={`/motion/${name}.webm`} type="video/webm" />
    </video>
  )
}
