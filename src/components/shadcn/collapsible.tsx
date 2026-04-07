"use client"

import type { JSX } from "react"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

function Collapsible({ ...props }: Readonly<CollapsiblePrimitive.Root.Props>): JSX.Element {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: Readonly<CollapsiblePrimitive.Trigger.Props>): JSX.Element {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
}

function CollapsibleContent({ ...props }: Readonly<CollapsiblePrimitive.Panel.Props>): JSX.Element {
  return <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
