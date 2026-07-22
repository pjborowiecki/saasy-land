import type { ClockPort } from "~/src/modules/shared-kernel/application/ports/clock.port"

export class SystemClockAdapter implements ClockPort {
  now(): Date {
    return new Date()
  }
}
