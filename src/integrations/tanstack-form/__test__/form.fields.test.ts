import { expect, it } from "vite-plus/test"

import { fieldErrorMessage } from "~/src/integrations/tanstack-form/form.fields"

it("extracts the first form error from strings and validation issues", () => {
  expect(fieldErrorMessage(["Required", "Other"])).toBe("Required")
  expect(fieldErrorMessage([{ message: "Invalid email" }])).toBe("Invalid email")
})
it("ignores unrecognized and missing errors", () => {
  for (const errors of [[], [null], [42], [{}], [{ message: 42 }]]) {
    expect(fieldErrorMessage(errors)).toBeUndefined()
  }
})
