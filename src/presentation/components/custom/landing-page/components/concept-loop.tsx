import { type JSX, useEffect, useRef } from "react"

import { cn } from "~/src/lib/cn"

/**
 * A concept loop: a short, silent, seamless animation rendered from the Remotion project in
 * `remotion/` and embedded where the page makes a claim that is easier to show than to say.
 *
 * PERFORMANCE. `preload="none"` means nothing is fetched until the loop is close to the viewport,
 * an IntersectionObserver starts it on entry and pauses it on exit, and every source is a
 * sub-150KB VP9 file. Four of these plus the terminal add about half a megabyte to the page, all
 * of it deferred, and none of it is decoded while it is off-screen.
 *
 * FALLBACK. There is no MP4 companion. A browser that cannot play VP9 keeps showing the `poster`,
 * which is a still of the loop's resolved state, so the layout and the meaning both survive at a
 * twentieth of the bytes an H.264 pair would have cost.
 *
 * REDUCED MOTION. The loop is never started and never even fetched: the poster is what the
 * visitor gets. That is the whole content, because these are illustrations of claims the
 * surrounding copy already states in full.
 *
 * ACCESSIBILITY. A loop that illustrates copy sitting next to it is `aria-hidden`: announcing
 * "video" there would add a control to skip past and nothing to read. A loop that *is* the
 * content, like the console in the hero, takes a `label` instead and is announced as an image,
 * which is exactly what the screenshot it replaced did.
 */
/**
 * A rejected autoplay is not an error worth reporting: the poster is already the correct picture,
 * and every reason a browser refuses (data saver, battery saver, a standing user preference) is a
 * reason to leave it refused.
 */
const play = async (video: HTMLVideoElement, offsetSeconds: number): Promise<void> => {
  try {
    // Seek once, on the first play only: re-seeking on every re-entry would restart the story
    // From the same beat each time the visitor scrolled back.
    if (offsetSeconds > 0 && video.currentTime === 0) {
      video.currentTime = offsetSeconds
    }
    await video.play()
  } catch {
    // Intentionally silent; the poster stands in.
  }
}

interface ConceptLoopProps {
  readonly className?: string
  /** Announced as an image when the loop is content in its own right; omit for illustrations. */
  readonly label?: string
  readonly name: string
  /**
   * Seconds to seek to before the first play. Four loops of identical length starting together
   * beat in lockstep, which reads as one blinking grid rather than four instruments; offsetting
   * each one puts every cell on a different beat for the life of the page.
   */
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
