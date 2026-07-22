/** Match React Aria select triggers whose accessible name includes the current value text. */
export function selectTriggerNamed(value: string): (accessibleName: string) => boolean {
  return (accessibleName) => accessibleName.includes(value)
}
