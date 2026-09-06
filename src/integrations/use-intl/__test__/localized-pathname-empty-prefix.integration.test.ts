import { expect, it } from "vite-plus/test"

import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"
it("omits the default prefix and replaces an existing non-default prefix", () => {
  expect(localizePathname({ locale: "en-US", pathname: "/pl-PL/docs" })).toBe("/docs")
})
