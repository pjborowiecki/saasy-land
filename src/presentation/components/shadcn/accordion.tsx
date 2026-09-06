import type { ReactNode } from "react"

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import {
  DisclosurePanel as AccordionContentPrimitive,
  Heading as AccordionHeaderPrimitive,
  Disclosure as AccordionItemPrimitive,
  DisclosureGroup as AccordionPrimitive,
  Button as AccordionTriggerPrimitive,
  type ButtonProps,
  type DisclosureGroupProps,
  type DisclosurePanelProps,
  type DisclosureProps,
} from "react-aria-components"

import { cn } from "~/src/lib/cn"

const Accordion = ({ className, ...props }: Readonly<DisclosureGroupProps>) => (
  <AccordionPrimitive data-slot="accordion" className={cn("flex w-full flex-col", className)} {...props} />
)

const AccordionItem = ({ className, ...props }: Readonly<DisclosureProps>) => (
  <AccordionItemPrimitive data-slot="accordion-item" className={cn("not-last:border-b", className)} {...props} />
)

const AccordionTrigger = ({ className, children, ...props }: Omit<ButtonProps, "children"> & { children: ReactNode }) => (
  <AccordionHeaderPrimitive className="flex">
    <AccordionTriggerPrimitive
      slot="trigger"
      data-slot="accordion-trigger"
      className={cn(
        "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="accordion-trigger-icon"
        className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
      />
      <ChevronUpIcon
        data-slot="accordion-trigger-icon"
        className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
      />
    </AccordionTriggerPrimitive>
  </AccordionHeaderPrimitive>
)

const AccordionContent = ({ className, children, ...props }: Readonly<DisclosurePanelProps>) => (
  <AccordionContentPrimitive
    data-slot="accordion-content"
    className="h-(--disclosure-panel-height) overflow-clip text-sm transition-[height] data-open:animate-accordion-down data-closed:animate-accordion-up"
    {...props}
  >
    <div
      className={cn(
        "pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className,
      )}
    >
      {children}
    </div>
  </AccordionContentPrimitive>
)

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
