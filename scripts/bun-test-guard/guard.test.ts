import { describe, expect, it } from "bun:test"

describe("test runner", () => {
  it("use Vitest via bun run test", () => {
    expect().fail(
      [
        "This repo does not use Bun's native test runner.",
        "",
        "Run:  bun run test",
        "Not:  bun test",
      ].join("\n"),
    )
  })
})
