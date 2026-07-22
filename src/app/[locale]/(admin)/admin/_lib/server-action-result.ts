import type { ActionServerError } from "~/src/integrations/next-safe-action/action.client"

interface ServerActionResult<T> {
  readonly data?: T | undefined
  readonly serverError?: ActionServerError | undefined
}

export function unwrapServerActionData<T>(result: ServerActionResult<T>): T {
  if (result.serverError !== undefined) {
    throw new Error(result.serverError.message)
  }

  if (result.data === undefined) {
    throw new Error("Server action returned no data.")
  }

  return result.data
}
