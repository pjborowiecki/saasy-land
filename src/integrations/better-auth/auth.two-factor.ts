export interface TwoFactorEnableData {
  backupCodes: readonly string[]
  totpURI: string
}

export function parseTwoFactorEnableData(data: unknown): TwoFactorEnableData | undefined {
  if (typeof data !== "object" || data === null) {
    return undefined
  }

  if (!("totpURI" in data) || !("backupCodes" in data)) {
    return undefined
  }

  const { backupCodes, totpURI } = data

  if (typeof totpURI !== "string" || !Array.isArray(backupCodes)) {
    return undefined
  }

  if (!backupCodes.every((code): code is string => typeof code === "string")) {
    return undefined
  }

  return { backupCodes, totpURI }
}

export function extractTotpSecret(totpUri: string): string {
  try {
    const url = new URL(totpUri)
    return url.searchParams.get("secret") ?? totpUri
  } catch {
    return totpUri
  }
}

export function createOtpSlotIndices(length: number): number[] {
  return Array.from({ length }, (_, index) => index)
}
