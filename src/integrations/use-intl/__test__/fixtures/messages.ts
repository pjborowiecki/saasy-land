import type { AbstractIntlMessages } from "use-intl"

import type messages from "~/src/integrations/use-intl/en-US.d.json.ts"
import type { SupportedLocale } from "~/src/integrations/use-intl/i18n.config"
import { type NamespaceEntry, buildMessageTree } from "~/src/integrations/use-intl/i18n.messages"

const fixtures = import.meta.glob<AbstractIntlMessages>("../../../../../messages/*/*.json", { eager: true, import: "default" })

export const getTestMessages = (locale: SupportedLocale): typeof messages => {
  const entries = Object.entries(fixtures)
    .filter(([path]) => path.includes(`/${locale}/`))
    .toSorted(([left], [right]) => left.localeCompare(right))
    .map(([path, value]): NamespaceEntry => [path.slice(path.lastIndexOf("/") + 1, -5), value])
  // Namespace parity is checked by check:i18n; fixtures use the generated catalogue type.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return buildMessageTree(entries) as typeof messages
}
