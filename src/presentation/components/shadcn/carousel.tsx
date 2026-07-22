"use client"

import { createContext, use, useCallback, useEffect, useMemo, useState, type ComponentProps, type KeyboardEvent } from "react"

import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "~/src/utils"

import { Button } from "~/src/presentation/components/shadcn/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

interface CarouselProps {
  opts?: CarouselOptions | undefined
  orientation?: "horizontal" | "vertical" | undefined
  plugins?: CarouselPlugin | undefined
  setApi?: ((api: CarouselApi) => void) | undefined
}

interface CarouselContextProps extends CarouselProps {
  api: ReturnType<typeof useEmblaCarousel>[1]
  canScrollNext: boolean
  canScrollPrev: boolean
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  scrollNext: () => void
  scrollPrev: () => void
}

const CarouselContext = createContext<CarouselContextProps | undefined>(undefined)

function useCarousel() {
  const context = use(CarouselContext)

  if (context === undefined) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  children,
  className,
  opts,
  orientation = "horizontal",
  plugins,
  setApi,
  ...props
}: ComponentProps<"section"> & CarouselProps) {
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  )

  const t = useTranslations("components.shadcn.carousel")

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (carouselApi === undefined) {
      return
    }

    setCanScrollPrev(carouselApi.canScrollPrev())
    setCanScrollNext(carouselApi.canScrollNext())
  }, [])

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollNext, scrollPrev],
  )

  useEffect(
    function syncCarouselApi() {
      if (api === undefined || setApi === undefined) {
        return
      }

      setApi(api)
    },
    [api, setApi],
  )

  useEffect(
    function subscribeToCarouselSelection() {
      if (api === undefined) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return function unsubscribeFromCarouselSelection() {
        api.off("select", onSelect)
      }
    },
    [api, onSelect],
  )

  const contextValue = useMemo(
    () => ({
      api,
      canScrollNext,
      canScrollPrev,
      carouselRef,
      opts,
      orientation,
      plugins,
      scrollNext,
      scrollPrev,
      setApi,
    }),
    [api, canScrollNext, canScrollPrev, carouselRef, opts, orientation, plugins, scrollNext, scrollPrev, setApi],
  )

  return (
    <CarouselContext.Provider value={contextValue}>
      <section
        aria-label={t("carouselLabel")}
        aria-roledescription="carousel"
        className={cn("relative", className)}
        data-slot="carousel"
        onKeyDownCapture={handleKeyDown}
        {...props}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div className="overflow-hidden" data-slot="carousel-content" ref={carouselRef}>
      <div className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)} {...props} />
    </div>
  )
}

function CarouselItem({ className, ...props }: ComponentProps<"fieldset">) {
  const { orientation } = useCarousel()

  return (
    <fieldset
      aria-roledescription="slide"
      className={cn("m-0 min-w-0 shrink-0 grow-0 basis-full border-0 p-0", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
      data-slot="carousel-item"
      {...props}
    />
  )
}

function CarouselPrevious({ className, size = "icon-sm", variant = "outline", ...props }: ComponentProps<typeof Button>) {
  const t = useTranslations("components.shadcn.carousel")
  const { canScrollPrev, orientation, scrollPrev } = useCarousel()

  return (
    <Button
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal" ? "inset-y-0 -left-12 my-auto" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      data-slot="carousel-previous"
      isDisabled={!canScrollPrev}
      onPress={scrollPrev}
      size={size}
      variant={variant}
      {...props}
    >
      <ChevronLeftIcon className="cn-rtl-flip" />
      <span className="sr-only">{t("previousSlide")}</span>
    </Button>
  )
}

function CarouselNext({ className, size = "icon-sm", variant = "outline", ...props }: ComponentProps<typeof Button>) {
  const { canScrollNext, orientation, scrollNext } = useCarousel()
  const t = useTranslations("components.shadcn.carousel")

  return (
    <Button
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal" ? "inset-y-0 -right-12 my-auto" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      data-slot="carousel-next"
      isDisabled={!canScrollNext}
      onPress={scrollNext}
      size={size}
      variant={variant}
      {...props}
    >
      <ChevronRightIcon className="cn-rtl-flip" />
      <span className="sr-only">{t("nextSlide")}</span>
    </Button>
  )
}

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel }
