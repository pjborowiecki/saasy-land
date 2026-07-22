import { ConflictError } from "~/src/modules/shared-kernel/domain/errors/conflict.error"
import { ForbiddenError } from "~/src/modules/shared-kernel/domain/errors/forbidden.error"
import { NotFoundError } from "~/src/modules/shared-kernel/domain/errors/not-found.error"
import { UnauthorizedError } from "~/src/modules/shared-kernel/domain/errors/unauthorized.error"
import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"

describe("domain errors", () => {
  it("creates conflict errors", () => {
    expect.hasAssertions()
    const error = new ConflictError("already exists")
    expect(error).toBeInstanceOf(ConflictError)
    expect(error.code).toBe("CONFLICT")
    expect(error.message).toBe("already exists")
    expect(error.name).toBe("ConflictError")
  })

  it("creates forbidden errors with default and custom messages", () => {
    expect.hasAssertions()
    expect(new ForbiddenError().message).toBe("Forbidden")
    expect(new ForbiddenError("nope").message).toBe("nope")
    expect(new ForbiddenError().code).toBe("FORBIDDEN")
  })

  it("creates not-found errors with a resource name", () => {
    expect.hasAssertions()
    const error = new NotFoundError("Product")
    expect(error.code).toBe("NOT_FOUND")
    expect(error.message).toBe("Product not found")
    expect(error.name).toBe("NotFoundError")
  })

  it("creates unauthorized errors with default and custom messages", () => {
    expect.hasAssertions()
    expect(new UnauthorizedError().message).toBe("Unauthorized")
    expect(new UnauthorizedError("login required").message).toBe("login required")
    expect(new UnauthorizedError().code).toBe("UNAUTHORIZED")
  })

  it("creates validation errors", () => {
    expect.hasAssertions()
    const error = new ValidationError("bad input")
    expect(error.code).toBe("VALIDATION")
    expect(error.message).toBe("bad input")
    expect(error.name).toBe("ValidationError")
  })
})
