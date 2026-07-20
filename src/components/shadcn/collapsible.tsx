"use client"

import {
  DisclosurePanel as CollapsibleContentPrimitive,
  Disclosure as CollapsiblePrimitive,
  Button as CollapsibleTriggerPrimitive,
  type ButtonProps,
  type DisclosurePanelProps,
  type DisclosureProps,
} from "react-aria-components"

function Collapsible({ ...props }: Readonly<DisclosureProps>) {
  return <CollapsiblePrimitive data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: Readonly<ButtonProps>) {
  return <CollapsibleTriggerPrimitive slot="trigger" data-slot="collapsible-trigger" {...props} />
}

function CollapsibleContent({ ...props }: Readonly<DisclosurePanelProps>) {
  return <CollapsibleContentPrimitive data-slot="collapsible-content" {...props} />
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
