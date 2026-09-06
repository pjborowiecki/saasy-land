import { LabelContext, Label as LabelPrimitive, type LabelProps } from "react-aria-components"

import { cn } from "~/src/lib/cn"

const Label = ({ className, htmlFor, slot, ...props }: Readonly<LabelProps>) => {
  const label = (
    <LabelPrimitive
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-disabled:opacity-50",
        className,
      )}
      {...props}
      htmlFor={htmlFor}
      slot={slot}
    />
  )

  if (htmlFor !== undefined && htmlFor !== "" && slot === undefined) {
    return <LabelContext.Provider value={undefined}>{label}</LabelContext.Provider>
  }

  return label
}

export { Label }
