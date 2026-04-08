"use client"

import {
  type ComponentProps,
  createContext,
  type JSX,
  type KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "~/src/lib/utils"

import { Button } from "~/src/components/shadcn/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: ComponentProps<"div"> & CarouselProps): JSX.Element {
  const t = useTranslations("shadcnComponents.carousel")

  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext],
  )

  useEffect(
    function publishCarouselApi() {
      if (!api || !setApi) return
      setApi(api)
    },
    [api, setApi],
  )

  useEffect(
    function syncCarouselScrollState() {
      if (!api) return
      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("reInit", onSelect)
        api?.off("select", onSelect)
      }
    },
    [api, onSelect],
  )

  const resolvedOrientation = orientation || (opts?.axis === "y" ? "vertical" : "horizontal")

  const contextValue = useMemo<CarouselContextProps>(
    () => ({
      carouselRef,
      api: api,
      opts,
      orientation: resolvedOrientation,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      setApi,
      plugins,
    }),
    [carouselRef, api, opts, resolvedOrientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext, setApi, plugins],
  )

  return (
    <CarouselContext.Provider value={contextValue}>
      <section
        {...props}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        aria-roledescription="carousel"
        aria-label={props["aria-label"] ?? t("carouselLabel")}
        data-slot="carousel"
      >
        {children}
      </section>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: ComponentProps<"div">): JSX.Element {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
      <div className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)} {...props} />
    </div>
  )
}

function CarouselItem({ className, ...props }: ComponentProps<"div">): JSX.Element {
  const { orientation } = useCarousel()

  return (
    <div
      data-slot="carousel-item"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
      {...props}
    />
  )
}

function CarouselPrevious({ className, variant = "outline", size = "icon-sm", ...props }: ComponentProps<typeof Button>): JSX.Element {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  const t = useTranslations("shadcnComponents.carousel")

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation",
        orientation === "horizontal" ? "top-1/2 -left-12 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="sr-only">{t("previousSlide")}</span>
    </Button>
  )
}

function CarouselNext({ className, variant = "outline", size = "icon-sm", ...props }: ComponentProps<typeof Button>): JSX.Element {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  const t = useTranslations("shadcnComponents.carousel")

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation",
        orientation === "horizontal" ? "top-1/2 -right-12 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon />
      <span className="sr-only">{t("nextSlide")}</span>
    </Button>
  )
}

export { Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel }
