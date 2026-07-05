import { useCallback, type SubmitEvent } from "react"

import type { FieldValues, UseFormReturn } from "react-hook-form"

export function useFormSubmitHandler<T extends FieldValues>(
  form: UseFormReturn<T>,
  onValid: (data: T) => Promise<void> | void,
): (event: SubmitEvent<HTMLFormElement>) => void {
  return useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      void form.handleSubmit(onValid)(event)
    },
    [form, onValid],
  )
}
