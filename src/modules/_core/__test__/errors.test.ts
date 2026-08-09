import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"

describe("app error", () => {
  it("carries the code and message", () => {
    expect.hasAssertions()
    const error = new AppError(ERROR_CODES.NOT_FOUND, "category.errors.notFound")
    expect(error).toBeInstanceOf(AppError)
    expect(error).toBeInstanceOf(Error)
    expect(error.code).toBe("NOT_FOUND")
    expect(error.message).toBe("category.errors.notFound")
    expect(error.name).toBe("AppError")
  })

  it("defaults the message to the code", () => {
    expect.hasAssertions()
    expect(new AppError(ERROR_CODES.UNAUTHORIZED).message).toBe("UNAUTHORIZED")
    expect(new AppError(ERROR_CODES.FORBIDDEN).message).toBe("FORBIDDEN")
  })

  it("exposes one catalog of error codes", () => {
    expect.hasAssertions()
    expect(Object.values(ERROR_CODES)).toStrictEqual([
      "AUTH_API_ERROR",
      "CONFLICT",
      "FORBIDDEN",
      "INTERNAL_ERROR",
      "NOT_FOUND",
      "TOO_MANY_REQUESTS",
      "UNAUTHORIZED",
      "VALIDATION",
    ])
  })
})
