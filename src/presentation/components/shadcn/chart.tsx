import { type CSSProperties, type ComponentProps, type ComponentType, type ReactNode, createContext, use, useId, useMemo } from "react"

import type { TooltipValueType } from "recharts"
import * as RechartsPrimitive from "recharts"

import { cn } from "~/src/lib/cn"

const THEME_ENTRIES = [
  { name: "dark", prefix: ".dark" },
  { name: "light", prefix: "" },
] as const

const INITIAL_DIMENSION = { height: 200, width: 320 } as const
const SINGLE_PAYLOAD_ITEM_COUNT = 1

type TooltipNameType = number | string
type ThemeName = (typeof THEME_ENTRIES)[number]["name"]
type ChartTheme = Record<ThemeName, string>

type ChartConfig = Record<
  string,
  {
    icon?: ComponentType | undefined
    label?: ReactNode | undefined
  } & ({ color?: string | undefined; theme?: never } | { color?: never; theme: ChartTheme })
>

interface ChartContextProps {
  config: ChartConfig
}

const ChartContext = createContext<ChartContextProps | undefined>(undefined)

const useChart = () => {
  const context = use(ChartContext)

  if (context === undefined) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const isNonNullObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && Boolean(value)

const getStringProp = (record: Record<string, unknown>, key: string): string | undefined => {
  const value = record[key]
  return typeof value === "string" ? value : undefined
}

const toDisplayKey = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value)
  }

  return "value"
}

const ChartContainer = ({
  children,
  className,
  config,
  id,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: ComponentProps<"div"> & {
  children: ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
  config: ChartConfig
  initialDimension?: {
    height: number
    width: number
  }
}) => {
  const uniqueId = useId()
  const chartId = `chart-${id ?? uniqueId.replaceAll(":", "")}`
  const contextValue = useMemo(() => ({ config }), [config])

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        data-chart={chartId}
        data-slot="chart"
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const buildChartStyleHtml = (id: string, config: ChartConfig): string => {
  const colorConfig = Object.entries(config).filter(([, itemConfig]) => itemConfig.theme !== undefined || itemConfig.color !== undefined)

  if (colorConfig.length === 0) {
    return ""
  }

  return THEME_ENTRIES.map(({ name, prefix }) => {
    const declarations = colorConfig
      .map(([key, itemConfig]) => {
        const color = itemConfig.theme?.[name] ?? itemConfig.color
        if (color === undefined || color === "") {
          return ""
        }

        return `  --color-${key}: ${color};`
      })
      .filter((declaration) => declaration !== "")
      .join("\n")

    return `${prefix} [data-chart=${id}] {\n${declarations}\n}`
  }).join("\n")
}

const ChartStyle = ({ config, id }: Readonly<{ config: ChartConfig; id: string }>) => {
  const html = useMemo(() => buildChartStyleHtml(id, config), [config, id])
  const styleContent = useMemo(() => ({ __html: html }), [html])

  if (html === "") {
    return
  }

  return <style dangerouslySetInnerHTML={styleContent} />
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipIndicator = ({
  indicator,
  indicatorColor,
  nestLabel,
}: Readonly<{
  indicator: "line" | "dot" | "dashed"
  indicatorColor: string | undefined
  nestLabel: boolean
}>) => {
  const style = useMemo(() => {
    if (indicatorColor === undefined) {
      return
    }

    const indicatorStyle: CSSProperties & Record<`--${string}`, string> = {
      "--color-bg": indicatorColor,
      "--color-border": indicatorColor,
    }

    return indicatorStyle
  }, [indicatorColor])

  return (
    <div
      className={cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
        "h-2.5 w-2.5": indicator === "dot",
        "my-0.5": nestLabel && indicator === "dashed",
        "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
        "w-1": indicator === "line",
      })}
      style={style}
    />
  )
}

type TooltipPayloadItem = NonNullable<RechartsPrimitive.DefaultTooltipContentProps<TooltipValueType, TooltipNameType>["payload"]>[number]

const ChartTooltipItem = ({
  formatter,
  hideIndicator,
  index,
  indicator,
  item,
  nameKey,
  nestLabel,
  payload,
  payloadColor,
  tooltipLabel,
}: Readonly<{
  formatter: RechartsPrimitive.DefaultTooltipContentProps<TooltipValueType, TooltipNameType>["formatter"] | undefined
  hideIndicator: boolean
  index: number
  indicator: "line" | "dot" | "dashed"
  item: TooltipPayloadItem
  nameKey: string | undefined
  nestLabel: boolean
  payload: readonly TooltipPayloadItem[]
  payloadColor: string | undefined
  tooltipLabel: ReactNode
}>) => {
  const { config } = useChart()
  const key = toDisplayKey(nameKey ?? item.name ?? item.dataKey)
  const itemConfig = getPayloadConfigFromPayload(config, item, key)
  const itemPayload = isNonNullObject(item.payload) ? item.payload : undefined
  const fillColor = itemPayload !== undefined && typeof itemPayload["fill"] === "string" ? itemPayload["fill"] : undefined
  const resolvedIndicatorColor = payloadColor ?? fillColor ?? (typeof item.color === "string" ? item.color : undefined)
  const Icon = itemConfig?.icon

  const indicatorNode = (() => {
    if (Icon !== undefined) {
      return <Icon />
    }

    if (hideIndicator) {
      return
    }

    return <ChartTooltipIndicator indicator={indicator} indicatorColor={resolvedIndicatorColor} nestLabel={nestLabel} />
  })()

  const valueNode =
    item.value === undefined ? undefined : (
      <span className="font-mono font-medium text-foreground tabular-nums">
        {typeof item.value === "number" ? item.value.toLocaleString() : String(item.value)}
      </span>
    )

  if (formatter !== undefined && item.value !== undefined && item.name !== undefined) {
    return (
      <div
        className={cn(
          "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
          indicator === "dot" && "items-center",
        )}
      >
        {formatter(item.value, item.name, item, index, payload)}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
        indicator === "dot" && "items-center",
      )}
    >
      {indicatorNode}
      <div className={cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center")}>
        <div className="grid gap-1.5">
          {nestLabel ? tooltipLabel : undefined}
          <span className="text-muted-foreground">{itemConfig?.label ?? item.name}</span>
        </div>
        {valueNode}
      </div>
    </div>
  )
}

const ChartTooltipContent = ({
  active,
  className,
  color,
  formatter,
  hideIndicator = false,
  hideLabel = false,
  indicator = "dot",
  label,
  labelClassName,
  labelFormatter,
  labelKey,
  nameKey,
  payload,
}: ComponentProps<typeof RechartsPrimitive.Tooltip> &
  ComponentProps<"div"> & {
    hideIndicator?: boolean | undefined
    hideLabel?: boolean | undefined
    indicator?: "line" | "dot" | "dashed" | undefined
    labelKey?: string | undefined
    nameKey?: string | undefined
  } & Omit<RechartsPrimitive.DefaultTooltipContentProps<TooltipValueType, TooltipNameType>, "accessibilityLayer">) => {
  const { config } = useChart()

  const tooltipLabel = useMemo(() => {
    if (hideLabel || payload === undefined || payload.length === 0) {
      return
    }

    const [item] = payload
    const key = toDisplayKey(labelKey ?? item?.dataKey ?? item?.name)
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value = labelKey === undefined && typeof label === "string" ? (config[label]?.label ?? label) : itemConfig?.label

    if (labelFormatter !== undefined) {
      return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
    }

    if (value === undefined || value === false || value === "") {
      return
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [config, hideLabel, label, labelClassName, labelFormatter, labelKey, payload])

  const tooltipItems = useMemo(() => (payload === undefined ? [] : payload.filter((item) => item.type !== "none")), [payload])

  if (active !== true || payload === undefined || payload.length === 0) {
    return
  }

  const nestLabel = payload.length === SINGLE_PAYLOAD_ITEM_COUNT && indicator !== "dot"
  const headerLabel = nestLabel ? undefined : tooltipLabel

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {headerLabel}
      <div className="grid gap-1.5">
        {tooltipItems.map((item, index) => (
          <ChartTooltipItem
            formatter={formatter}
            hideIndicator={hideIndicator}
            index={index}
            indicator={indicator}
            item={item}
            key={toDisplayKey(item.dataKey ?? item.name ?? index)}
            nameKey={nameKey}
            nestLabel={nestLabel}
            payload={payload}
            payloadColor={color}
            tooltipLabel={tooltipLabel}
          />
        ))}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

const LegendSwatch = ({ color }: Readonly<{ color: string | undefined }>) => {
  const style = useMemo((): CSSProperties | undefined => {
    if (color === undefined) {
      return
    }

    return { backgroundColor: color }
  }, [color])

  return <div className="h-2 w-2 shrink-0 rounded-[2px]" style={style} />
}

const isTopLegendPosition = (position: string | undefined): boolean => {
  if (position === undefined) {
    return false
  }

  return position === "top" || position.startsWith("insideTop")
}

const ChartLegendContent = ({
  className,
  hideIcon = false,
  nameKey,
  payload,
  position,
  verticalAlign,
}: ComponentProps<"div"> & {
  hideIcon?: boolean | undefined
  nameKey?: string | undefined
  payload?: RechartsPrimitive.DefaultLegendContentProps["payload"]
  /** Recharts 3.10+ legend placement. Prefer this over `verticalAlign`. */
  position?: string | undefined
  /** Still injected by Recharts when `Legend` uses the legacy prop. */
  verticalAlign?: "bottom" | "middle" | "top" | undefined
}) => {
  const { config } = useChart()
  const legendPosition = position ?? verticalAlign ?? "bottom"

  if (payload === undefined || payload.length === 0) {
    return
  }

  const visiblePayload = payload.filter((item) => item.type !== "none")

  return (
    <div className={cn("flex items-center justify-center gap-4", isTopLegendPosition(legendPosition) ? "pb-3" : "pt-3", className)}>
      {visiblePayload.map((item) => {
        const key = toDisplayKey(nameKey ?? item.dataKey)
        const itemConfig = getPayloadConfigFromPayload(config, item, key)
        const Icon = itemConfig?.icon

        return (
          <div
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            key={toDisplayKey(item.dataKey ?? item.value ?? key)}
          >
            {Icon !== undefined && !hideIcon ? <Icon /> : <LegendSwatch color={item.color} />}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

const getPayloadConfigFromPayload = (config: ChartConfig, payload: unknown, key: string) => {
  if (!isNonNullObject(payload)) {
    return
  }

  const nestedCandidate = payload["payload"]
  const nestedPayload = isNonNullObject(nestedCandidate) ? nestedCandidate : undefined
  const nestedLabel = nestedPayload === undefined ? undefined : getStringProp(nestedPayload, key)
  const configLabelKey = getStringProp(payload, key) ?? nestedLabel ?? key

  if (configLabelKey in config) {
    return config[configLabelKey]
  }

  return config[key]
}

export { ChartContainer, ChartLegend, ChartLegendContent, ChartStyle, ChartTooltip, ChartTooltipContent, type ChartConfig }
