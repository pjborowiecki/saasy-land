export const extractTotpSecret = (totpUri: string): string => {
  try {
    const url = new URL(totpUri)
    return url.searchParams.get("secret") ?? totpUri
  } catch {
    return totpUri
  }
}

export const createOtpSlotIndices = (length: number): number[] => Array.from({ length }, (_, index) => index)
