import { createCn } from "cn/config"

// Register the typography tokens from globals.css so cn keeps sizes alongside text colors.
const TYPE_RAMP_SIZES = [
  "body",
  "body-sm",
  "display-blast",
  "display-gate",
  "display-hero",
  "headline-peak",
  "headline-support",
  "label",
  "lead",
  "price",
  "spec",
  "statement",
  "title",
] as const

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TYPE_RAMP_SIZES] }],
    },
  },
})
