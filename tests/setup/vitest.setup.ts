import "@testing-library/jest-dom/vitest"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const EQUALS_SIGN_INDEX_NOT_FOUND = -1
const QUOTE_SLICE_START = 1
const QUOTE_SLICE_END = -1

function loadEnvLocal(): void {
  const envPath = resolve(process.cwd(), ".env.local")

  if (!existsSync(envPath)) {
    return
  }

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim()

    if (trimmed && !trimmed.startsWith("#")) {
      const separatorIndex = trimmed.indexOf("=")

      if (separatorIndex !== EQUALS_SIGN_INDEX_NOT_FOUND) {
        const key = trimmed.slice(0, separatorIndex)
        let value = trimmed.slice(separatorIndex + QUOTE_SLICE_START).trim()

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(QUOTE_SLICE_START, QUOTE_SLICE_END)
        }

        process.env[key] ??= value
      }
    }
  }
}

loadEnvLocal()
