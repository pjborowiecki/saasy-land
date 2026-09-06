import {
  type ButtonProps,
  DisclosurePanel as CollapsibleContentPrimitive,
  Disclosure as CollapsiblePrimitive,
  Button as CollapsibleTriggerPrimitive,
  type DisclosurePanelProps,
  type DisclosureProps,
} from "react-aria-components"

const Collapsible = ({ ...props }: Readonly<DisclosureProps>) => <CollapsiblePrimitive data-slot="collapsible" {...props} />

const CollapsibleTrigger = ({ ...props }: Readonly<ButtonProps>) => (
  <CollapsibleTriggerPrimitive slot="trigger" data-slot="collapsible-trigger" {...props} />
)

const CollapsibleContent = ({ ...props }: Readonly<DisclosurePanelProps>) => (
  <CollapsibleContentPrimitive data-slot="collapsible-content" {...props} />
)

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
