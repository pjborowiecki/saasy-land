import type { JSX } from "react"

import { CONSTANTS } from "~/src/constants"

export default function Home(): JSX.Element {
  return <div>{CONSTANTS.APP_NAME}</div>
}
