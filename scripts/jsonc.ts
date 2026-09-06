import { parse, type ParseError } from "jsonc-parser"
import { readFile } from "node:fs/promises"

export const readJsonc = async (path: string): Promise<unknown> => {
  const errors: ParseError[] = []
  const value: unknown = parse(await readFile(path, "utf8"), errors, { allowTrailingComma: true })
  if (errors.length > 0) throw new Error(`Invalid JSONC configuration: ${path}`)
  return value
}
