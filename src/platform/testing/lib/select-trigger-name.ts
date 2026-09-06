/** Match React Aria select triggers whose accessible name includes the current value text. */
export const selectTriggerNamed =
  (value: string): ((accessibleName: string) => boolean) =>
  (accessibleName) =>
    accessibleName.includes(value)
