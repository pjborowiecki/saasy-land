"use client"

import { type ComponentProps, type ComponentType, createContext, type JSX, type ReactNode, useContext, useId, useMemo } from "react"

import type { TooltipValueType } from "recharts"
import * as RechartsPrimitive from "recharts"

import { cn, cssVars } from "~/src/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { dark: ".dark", light: "" } as const
type ChartTheme = keyof typeof THEMES

const INITIAL_DIMENSION = { height: 200, width: 320 } as const
const SINGLE_PAYLOAD_ITEM = 1
type TooltipNameType = number | string

interface ChartTooltipPayloadItem {
  color?: string | undefined
  dataKey?: number | string | undefined
  name?: string | undefined
  payload?: { fill?: string } | undefined
  type?: string | undefined
  value?: unknown
}

function isChartTheme(theme: string): theme is ChartTheme {
  return theme === "dark" || theme === "light"
}

function toPayloadKey(value: number | string | undefined): string {
  if (typeof value === "number") {
    return String(value)
  }
  if (typeof value === "string") {
    return value
  }
  return "value"
}

function getStringProperty(object: object, key: string): string | undefined {
  if (!(key in object)) {
    return
  }

  const propertyDescriptor = Object.getOwnPropertyDescriptor(object, key)
  const propertyValue: unknown = propertyDescriptor?.value
  return typeof propertyValue === "string" ? propertyValue : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getFillColor(payload: unknown): string | undefined {
  if (!isRecord(payload)) {
    return
  }

  const { fill } = payload
  return typeof fill === "string" ? fill : undefined
}

function resolvePayloadKey(
  preferredKey: string | undefined,
  dataKey: number | string | ((object: unknown) => unknown) | undefined,
  name: TooltipNameType | undefined,
): string {
  if (preferredKey !== undefined) {
    return preferredKey
  }
  if (typeof dataKey === "string" || typeof dataKey === "number") {
    return toPayloadKey(dataKey)
  }
  if (typeof name === "string") {
    return name
  }
  return "value"
}

function toChartTooltipPayloadItem(item: {
  color?: string
  dataKey?: number | string | ((object: unknown) => unknown)
  name?: TooltipNameType
  payload?: { fill?: string }
  type?: string
  value?: unknown
}): ChartTooltipPayloadItem {
  return {
    color: item.color,
    dataKey: typeof item.dataKey === "string" || typeof item.dataKey === "number" ? item.dataKey : undefined,
    name: typeof item.name === "string" ? item.name : undefined,
    payload: item.payload,
    type: item.type,
    value: item.value,
  }
}

function formatTooltipValue(value: unknown): string {
  if (typeof value === "number") {
    return value.toLocaleString()
  }

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "bigint") {
    return value.toString()
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false"
  }

  return ""
}

function hasChartColor(itemConfig: ChartConfigItem): boolean {
  return itemConfig.theme !== undefined || itemConfig.color !== undefined
}

export type ChartConfig = Record<
  string,
  {
    label?: ReactNode
    icon?: ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
>

type ChartConfigItem = ChartConfig[string]

interface ChartContextProps {
  config: ChartConfig
}

const ChartContext = createContext<ChartContextProps | undefined>(undefined)

function useChart() {
  const context = useContext(ChartContext)

  if (context === undefined) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: ComponentProps<"div"> & {
  config: ChartConfig
  children: ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
  initialDimension?: {
    width: number
    height: number
  }
}): JSX.Element {
  const uniqueId = useId()
  const chartId = `chart-${id ?? uniqueId.replaceAll(":", "")}`

  const contextValue = useMemo(() => ({ config }), [config])

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }): JSX.Element | undefined => {
  const colorConfig = Object.entries(config).filter(([, itemConfig]) => hasChartColor(itemConfig))

  if (colorConfig.length === 0) {
    return
  }

  const css = Object.entries(THEMES)
    .map(
      ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const themeColor = isChartTheme(theme) ? itemConfig.theme?.[theme] : undefined
    const color = themeColor ?? itemConfig.color
    return color !== undefined && color !== "" ? `  --color-${key}: ${color};` : undefined
  })
  .filter((line): line is string => line !== undefined)
  .join("\n")}
}
`,
    )
    .join("\n")

  return <style>{css}</style>
}

const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipItemDetailsProps {
  readonly item: ChartTooltipPayloadItem
  readonly itemConfig: ReturnType<typeof getPayloadConfigFromPayload>
  readonly nestLabel: boolean
  readonly tooltipLabel: ReactNode
}

function ChartTooltipItemDetails({ item, itemConfig, nestLabel, tooltipLabel }: ChartTooltipItemDetailsProps): JSX.Element {
  return (
    <div className={cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center")}>
      <div className="grid gap-1.5">
        {nestLabel ? tooltipLabel : undefined}
        <span className="text-muted-foreground">{itemConfig?.label ?? item.name}</span>
      </div>
      {typeof item.value === "number" || typeof item.value === "string" ? (
        <span className="font-mono font-medium text-foreground tabular-nums">{formatTooltipValue(item.value)}</span>
      ) : undefined}
    </div>
  )
}

interface ChartTooltipItemDefaultProps {
  readonly hideIndicator: boolean
  readonly indicator: "line" | "dot" | "dashed"
  readonly indicatorColor: string | undefined
  readonly item: ChartTooltipPayloadItem
  readonly itemConfig: ReturnType<typeof getPayloadConfigFromPayload>
  readonly nestLabel: boolean
  readonly tooltipLabel: ReactNode
}

function ChartTooltipItemDefault({
  hideIndicator,
  indicator,
  indicatorColor,
  item,
  itemConfig,
  nestLabel,
  tooltipLabel,
}: ChartTooltipItemDefaultProps): JSX.Element {
  const indicatorStyle = cssVars({
    "--color-bg": indicatorColor ?? "",
    "--color-border": indicatorColor ?? "",
  })

  return (
    <>
      {itemConfig?.icon ? (
        <itemConfig.icon />
      ) : (
        !hideIndicator && (
          <div
            className={cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
              "h-2.5 w-2.5": indicator === "dot",
              "my-0.5": nestLabel && indicator === "dashed",
              "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
              "w-1": indicator === "line",
            })}
            style={indicatorStyle}
          />
        )
      )}
      <ChartTooltipItemDetails item={item} itemConfig={itemConfig} nestLabel={nestLabel} tooltipLabel={tooltipLabel} />
    </>
  )
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ComponentProps<typeof RechartsPrimitive.Tooltip> &
  ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & Omit<RechartsPrimitive.DefaultTooltipContentProps<TooltipValueType, TooltipNameType>, "accessibilityLayer">):
  | JSX.Element
  | undefined {
  const { config } = useChart()

  const tooltipLabel = useMemo(() => {
    if (hideLabel || payload === undefined || payload.length === 0) {
      return
    }

    const [item] = payload
    const key = resolvePayloadKey(labelKey, item?.dataKey, item?.name)
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value = labelKey === undefined && typeof label === "string" ? (config[label]?.label ?? label) : itemConfig?.label

    if (labelFormatter) {
      return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
    }

    if (value === undefined || value === false || value === "") {
      return
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

  if (active !== true || payload === undefined || payload.length === 0) {
    return
  }

  const nestLabel = payload.length === SINGLE_PAYLOAD_ITEM && indicator !== "dot"

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {!nestLabel && tooltipLabel}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = resolvePayloadKey(nameKey, item.dataKey, item.name)
            const reactKey = `${key}-${resolvePayloadKey(undefined, item.dataKey, item.name)}-${typeof item.name === "string" ? item.name : ""}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const fillColor = getFillColor(item.payload)
            const indicatorColor = color ?? fillColor ?? (typeof item.color === "string" ? item.color : undefined)

            return (
              <div
                key={reactKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter !== undefined && item.value !== undefined && item.name !== undefined ? (
                  formatter(item.value, item.name, item, index, payload)
                ) : (
                  <ChartTooltipItemDefault
                    hideIndicator={hideIndicator}
                    indicator={indicator}
                    indicatorColor={indicatorColor}
                    item={toChartTooltipPayloadItem(item)}
                    itemConfig={itemConfig}
                    nestLabel={nestLabel}
                    tooltipLabel={tooltipLabel}
                  />
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendColorSwatch({ color }: { color: string | undefined }): JSX.Element {
  const swatchStyle = useMemo(() => ({ backgroundColor: color }), [color])

  return <div className="h-2 w-2 shrink-0 rounded-[2px]" style={swatchStyle} />
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
} & RechartsPrimitive.DefaultLegendContentProps): JSX.Element | undefined {
  const { config } = useChart()

  if (payload === undefined || payload.length === 0) {
    return
  }

  return (
    <div className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = resolvePayloadKey(nameKey, item.dataKey, typeof item.value === "string" ? item.value : undefined)
          const reactKey = `${key}-${resolvePayloadKey(undefined, item.dataKey, typeof item.value === "string" ? item.value : undefined)}-${item.color ?? ""}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div key={reactKey} className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}>
              {itemConfig?.icon && !hideIcon ? <itemConfig.icon /> : <ChartLegendColorSwatch color={item.color} />}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string): ChartConfigItem | undefined {
  if (typeof payload !== "object" || payload === null) {
    return
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : undefined

  let configLabelKey = key

  const directValue = getStringProperty(payload, key)
  if (directValue !== undefined) {
    configLabelKey = directValue
  } else if (payloadPayload !== undefined) {
    const nestedValue = getStringProperty(payloadPayload, key)
    if (nestedValue !== undefined) {
      configLabelKey = nestedValue
    }
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export { ChartContainer, ChartLegend, ChartLegendContent, ChartStyle, ChartTooltip, ChartTooltipContent }
