import type { JSX } from "react"

import { useFormatter } from "use-intl/react"

import { CURRENCY_FORMAT, PPP_KEYS, PPP_PERCENT, applyPpp } from "~/src/modules/_core/constants/pricing"

export const Price = ({ amount }: Readonly<{ amount: number }>): JSX.Element => {
  const formatter = useFormatter()

  return (
    <span>
      {PPP_KEYS.map((key) => (
        <span className={`pv pv-${key}`} key={key}>
          {formatter.number(applyPpp({ amount, multiplier: key / PPP_PERCENT }), CURRENCY_FORMAT)}
        </span>
      ))}
    </span>
  )
}
