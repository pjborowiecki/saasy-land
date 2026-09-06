import { type ComponentProps, type ReactNode, type RefObject, use, useCallback, useMemo, useRef } from "react"

import type { Key } from "@react-types/shared"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"
import {
  Button as ButtonPrimitive,
  type ButtonProps,
  type ComboBoxState,
  ComboBoxStateContext,
  ComboBoxValue as ComboBoxValuePrimitive,
  type ComboBoxValueProps,
  Group,
  type GroupProps,
  Header as HeaderPrimitive,
  type HeaderProps,
  Input as InputPrimitive,
  type InputProps,
  ListBoxItem as ListBoxItemPrimitive,
  type ListBoxItemProps,
  ListBox as ListBoxPrimitive,
  type ListBoxProps,
  ListBoxSection as ListBoxSectionPrimitive,
  type ListBoxSectionProps,
  Popover as PopoverPrimitive,
  type PopoverProps,
  Separator as SeparatorPrimitive,
  type SeparatorProps,
  TagGroup as TagGroupPrimitive,
  TagList as TagListPrimitive,
  type TagListProps,
  Tag as TagPrimitive,
  type TagProps,
  composeRenderProps,
} from "react-aria-components"
import { useTranslations } from "use-intl/react"

import { cn } from "~/src/lib/cn"

import { Button } from "~/src/presentation/components/shadcn/button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "~/src/presentation/components/shadcn/input-group"

const DROP_LAST_CHIP_INDEX = -1

const clearComboBoxState = (state: ComboBoxState<unknown>): void => {
  state.selectionManager.setSelectedKeys(new Set())
  state.setInputValue("")
}

const ComboboxValue = <TValue,>({ ...props }: Readonly<ComboBoxValueProps<TValue>>) => (
  <ComboBoxValuePrimitive data-slot="combobox-value" {...props} />
)

const ComboboxTrigger = ({
  children,
  className,
  ...props
}: Omit<ButtonProps, "children"> & {
  children?: ReactNode
}) => (
  <ButtonPrimitive className={cn("[&_svg:not([class*='size-'])]:size-4", className)} data-slot="combobox-trigger" {...props}>
    {children}
    <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
  </ButtonPrimitive>
)

const ComboboxClear = ({ "aria-label": ariaLabel, className, ...props }: ComponentProps<typeof InputGroupButton>) => {
  const t = useTranslations("components.shadcn.combobox")
  const state = use(ComboBoxStateContext)

  const handleClear = useCallback(() => {
    if (!state) {
      return
    }

    clearComboBoxState(state)
  }, [state])

  if (!state || state.inputValue === "") {
    return
  }

  return (
    <InputGroupButton
      aria-label={ariaLabel ?? t("clear")}
      className={cn(className)}
      data-slot="combobox-clear"
      onPress={handleClear}
      size="icon-xs"
      variant="ghost"
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </InputGroupButton>
  )
}

const ComboboxInput = ({
  children,
  className,
  disabled = false,
  showClear = false,
  showTrigger = true,
  ...props
}: Omit<ComponentProps<typeof InputGroupInput>, "className" | "disabled"> & {
  className?: string
  disabled?: boolean
  showClear?: boolean
  showTrigger?: boolean
}) => (
  <InputGroup className={cn("w-auto", className)}>
    <InputGroupInput {...(disabled ? { disabled: true } : {})} {...props} />
    <InputGroupAddon align="inline-end">
      {showTrigger ? (
        <InputGroupButton
          className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent [&_svg:not([class*='size-'])]:size-4"
          data-slot="combobox-trigger"
          isDisabled={disabled}
          size="icon-xs"
          variant="ghost"
        >
          <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
        </InputGroupButton>
      ) : undefined}
      {showClear ? <ComboboxClear isDisabled={disabled} /> : undefined}
    </InputGroupAddon>
    {children}
  </InputGroup>
)

const ComboboxContent = ({
  anchor,
  className,
  crossOffset = 0,
  offset = 6,
  placement = "bottom",
  ...props
}: Omit<PopoverProps, "className"> & {
  anchor?: RefObject<Element | null>
  className?: string
}) => (
  <PopoverPrimitive
    className={cn(
      "relative isolate z-50 max-h-72 w-(--trigger-width) min-w-36 origin-(--trigger-anchor-point) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 **:data-[slot$=-item]:data-focused:bg-foreground/10 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none",
      className,
    )}
    crossOffset={crossOffset}
    data-slot="combobox-content"
    offset={offset}
    placement={placement}
    {...(anchor === undefined ? {} : { triggerRef: anchor })}
    {...props}
  />
)

const ComboboxList = <TValue extends object>({ className, ...props }: Readonly<ListBoxProps<TValue>>) => (
  <ListBoxPrimitive
    className={cn(
      "group/combobox-content no-scrollbar max-h-[inherit] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
      className,
    )}
    data-slot="combobox-list"
    {...props}
  />
)

const ComboboxItem = <TValue extends object>({ children, className, ...props }: Readonly<ListBoxItemProps<TValue>>) => {
  const textValueProps = typeof children === "string" ? { textValue: children } : {}

  return (
    <ListBoxItemPrimitive
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-focused:bg-accent data-focused:text-accent-foreground not-data-[variant=destructive]:data-focused:**:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="combobox-item"
      {...textValueProps}
      {...props}
    >
      {composeRenderProps(children, (renderedChildren, { isSelected }) => (
        <>
          {renderedChildren}
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
            {isSelected ? <CheckIcon className="pointer-events-none" /> : undefined}
          </span>
        </>
      ))}
    </ListBoxItemPrimitive>
  )
}

const ComboboxGroup = <TValue extends object>({ className, ...props }: Readonly<ListBoxSectionProps<TValue>>) => (
  <ListBoxSectionPrimitive className={cn(className)} data-slot="combobox-group" {...props} />
)

const ComboboxLabel = ({ className, ...props }: Readonly<HeaderProps>) => (
  <HeaderPrimitive className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)} data-slot="combobox-label" {...props} />
)

const ComboboxEmpty = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex",
      className,
    )}
    data-slot="combobox-empty"
    {...props}
  />
)

const ComboboxSeparator = ({ className, ...props }: Readonly<SeparatorProps>) => (
  <SeparatorPrimitive className={cn("-mx-1 my-1 h-px bg-border", className)} data-slot="combobox-separator" {...props} />
)

const ComboboxChips = ({ children, className, ...props }: Readonly<GroupProps>) => (
  <Group
    className={cn(
      "flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
      className,
    )}
    data-slot="combobox-chips"
    {...props}
  >
    {children}
  </Group>
)

const ComboboxChipListBody = <TValue extends object>({
  className,
  selectedItems,
  state,
  ...props
}: Omit<TagListProps<TValue>, "className" | "items"> & {
  className?: string
  selectedItems: readonly (TValue | null | undefined)[]
  state: ComboBoxState<TValue>
}) => {
  const items = useMemo(() => selectedItems.filter((item): item is TValue => Boolean(item)), [selectedItems])

  const handleRemove = useCallback(
    (keys: Set<Key>) => {
      const { value } = state
      if (!Array.isArray(value)) {
        return
      }

      state.setValue(value.filter((key): key is Key => (typeof key === "string" || typeof key === "number") && !keys.has(key)))
    },
    [state],
  )

  return (
    <TagGroupPrimitive className={cn("contents", className)} data-slot="combobox-chip-list" onRemove={handleRemove}>
      <TagListPrimitive className="contents" items={items} {...props} />
    </TagGroupPrimitive>
  )
}

const ComboboxChipList = <TValue extends object>({
  className,
  ...props
}: Omit<TagListProps<TValue>, "className" | "items"> & {
  className?: string
}) => (
  <ComboBoxValuePrimitive<TValue> className="contents">
    {({ selectedItems, state }) => (
      <ComboboxChipListBody selectedItems={selectedItems} state={state} {...(className === undefined ? {} : { className })} {...props} />
    )}
  </ComboBoxValuePrimitive>
)

const ComboboxChip = ({
  children,
  className,
  showRemove = true,
  ...props
}: Omit<TagProps, "children"> & {
  children?: ReactNode
  showRemove?: boolean
}) => (
  <TagPrimitive
    className={cn(
      "flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0",
      className,
    )}
    data-slot="combobox-chip"
    {...props}
  >
    {children}
    {showRemove ? (
      <Button className="-ml-1 opacity-50 hover:opacity-100" data-slot="combobox-chip-remove" size="icon-xs" slot="remove" variant="ghost">
        <XIcon className="pointer-events-none" />
      </Button>
    ) : undefined}
  </TagPrimitive>
)

const ComboboxChipsInput = ({ className, onKeyDown, ...props }: Readonly<InputProps>) => {
  const state = use(ComboBoxStateContext)

  const handleKeyDown = useCallback<NonNullable<InputProps["onKeyDown"]>>(
    (event) => {
      if (event.key === "Backspace" && event.currentTarget.value === "" && state && Array.isArray(state.value) && state.value.length > 0) {
        event.preventDefault()
        state.setValue(state.value.slice(0, DROP_LAST_CHIP_INDEX))
      }

      onKeyDown?.(event)
    },
    [onKeyDown, state],
  )

  return (
    <InputPrimitive
      className={cn("min-w-16 flex-1 outline-none", className)}
      data-slot="combobox-chip-input"
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

const useComboboxAnchor = (): RefObject<HTMLDivElement | null> => useRef<HTMLDivElement | null>(null)

export { ComboBox as Combobox, Collection as ComboboxCollection } from "react-aria-components"

export {
  ComboboxChip,
  ComboboxChipList,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
