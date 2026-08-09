export const PRODUCT_TABS = ["all", "onetime", "subscriptions", "categories", "collections", "drafts", "courses"] as const

export type ProductTab = (typeof PRODUCT_TABS)[number]

export function resolveProductTab(value: string | readonly string[] | undefined): ProductTab {
  return PRODUCT_TABS.find((tab) => tab === value) ?? "all"
}
