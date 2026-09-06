import type { ComponentProps } from "react"

import { I18nProvider, useLocale } from "react-aria-components"

const DirectionProvider = ({
  direction,
  locale: localeProp,
  ...props
}: ComponentProps<typeof I18nProvider> & {
  direction?: "ltr" | "rtl"
}) => {
  // For compatibility with Radix / Base UI, if only a `direction` is provided and not a `locale`,
  // Create a locale string that forces the direction by setting the script to arabic or latin.
  const { locale: currentLocale } = useLocale()

  let locale = localeProp
  if ((locale === undefined || locale === "") && direction !== undefined) {
    locale = new Intl.Locale(currentLocale, {
      script: direction === "rtl" ? "Arab" : "Latn",
    }).toString()
  }

  return <I18nProvider {...props} {...(locale === undefined || locale === "" ? {} : { locale })} />
}

const useDirection = () => {
  const { direction } = useLocale()
  return direction
}

export { DirectionProvider, useDirection }

export { I18nProvider, useLocale } from "react-aria-components"
