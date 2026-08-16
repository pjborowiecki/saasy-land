import { drizzleAdapter } from "better-auth/adapters/drizzle"

import {
  newsletterLocaleEnum,
  newsletterSourceEnum,
  newsletterStatusEnum,
  newsletterSubscriber,
} from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"

describe("newsletter subscriber schema", () => {
  it("materializes through drizzle adapter", () => {
    expect.hasAssertions()
    expect(
      drizzleAdapter(
        {},
        {
          provider: "pg",
          schema: { newsletterSubscriber },
        },
      ),
    ).toBeDefined()
  })

  it("defines enums and updatedAt onUpdate", () => {
    expect.hasAssertions()
    expect(newsletterStatusEnum.enumValues).toStrictEqual(["subscribed", "unsubscribed", "pending"])
    expect(newsletterSourceEnum.enumValues).toStrictEqual(["footer", "blog", "app"])
    expect(newsletterLocaleEnum.enumValues).toStrictEqual(["en-US", "pl-PL"])
    const onUpdate = newsletterSubscriber.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
  })
})
