import { randomUUIDv7 } from "bun"

import type { IdGeneratorPort } from "~/src/modules/shared-kernel/application/ports/id-generator.port"

export class UuidIdGeneratorAdapter implements IdGeneratorPort {
  generate(): string {
    return randomUUIDv7()
  }
}
