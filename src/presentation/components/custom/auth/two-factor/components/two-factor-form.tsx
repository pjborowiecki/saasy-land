import { type JSX, useCallback, useState } from "react"

import { TwoFactorBackupForm } from "~/src/presentation/components/custom/auth/two-factor/components/two-factor-backup-form"
import { TwoFactorTotpForm } from "~/src/presentation/components/custom/auth/two-factor/components/two-factor-totp-form"

type TwoFactorMode = "backup" | "totp"

export const TwoFactorForm = (): JSX.Element => {
  const [mode, setMode] = useState<TwoFactorMode>("totp")

  const handleToggleMode = useCallback(() => {
    setMode((current) => (current === "totp" ? "backup" : "totp"))
  }, [])

  if (mode === "backup") {
    return <TwoFactorBackupForm onToggleMode={handleToggleMode} />
  }

  return <TwoFactorTotpForm onToggleMode={handleToggleMode} />
}
