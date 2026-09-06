export type RequireAtLeastOne<TValue> = {
  [TKey in keyof TValue]-?: Required<Pick<TValue, TKey>> & Partial<Pick<TValue, Exclude<keyof TValue, TKey>>>
}[keyof TValue]
