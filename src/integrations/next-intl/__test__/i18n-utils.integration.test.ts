import { getLocaleMessagesDir, loadLocaleMessagesFromDir, resolveMessagesDir } from "~/src/integrations/next-intl/i18n.utils"

const FIXTURES_ROOT = "src/integrations/next-intl/__test__/fixtures/i18n-utils"
const INVALID_ARRAY_FIXTURE = `${FIXTURES_ROOT}/invalid-array`
const INVALID_VALUE_FIXTURE = `${FIXTURES_ROOT}/invalid-value`
const NESTED_INVALID_FIXTURE = `${FIXTURES_ROOT}/nested-invalid`
const MERGE_FIXTURE = `${FIXTURES_ROOT}/merge`
const CUSTOM_MESSAGES_ROOT = "/tmp/messages-root"
const EXPECTED_MESSAGES_SUFFIX = "src/integrations/next-intl/messages"

describe("load locale messages from dir component", () => {
  it("throws for invalid message files", () => {
    expect.hasAssertions()

    expect(() => loadLocaleMessagesFromDir("en-US", INVALID_ARRAY_FIXTURE)).toThrow(/Invalid message file/u)
  })

  it("throws when merged messages are invalid", () => {
    expect.hasAssertions()

    expect(() => loadLocaleMessagesFromDir("en-US", INVALID_VALUE_FIXTURE)).toThrow(/Invalid merged messages/u)
  })

  it("falls back to cwd when dirname is unavailable", () => {
    expect.hasAssertions()
    const { missingDirname }: { missingDirname?: string } = {}

    expect(resolveMessagesDir(missingDirname)).toBe(`${process.cwd()}/${EXPECTED_MESSAGES_SUFFIX}`)
    expect(resolveMessagesDir(Number.NaN)).toBe(`${process.cwd()}/${EXPECTED_MESSAGES_SUFFIX}`)
    expect(resolveMessagesDir(CUSTOM_MESSAGES_ROOT)).toBe(`${CUSTOM_MESSAGES_ROOT}/messages`)
  })

  it("rejects nested invalid intl message trees", () => {
    expect.hasAssertions()

    expect(() => loadLocaleMessagesFromDir("en-US", NESTED_INVALID_FIXTURE)).toThrow(/Invalid merged messages/u)
  })

  it("merges nested message files and uses cache", () => {
    expect.hasAssertions()

    const firstLoad = loadLocaleMessagesFromDir("en-US", MERGE_FIXTURE)
    const secondLoad = loadLocaleMessagesFromDir("en-US", MERGE_FIXTURE)

    expect(firstLoad).toStrictEqual(secondLoad)
    expect(firstLoad.pages).toBeDefined()
  })

  it("exposes the locale messages directory", () => {
    expect.hasAssertions()
    expect(getLocaleMessagesDir()).toContain("messages")
  })

  it("skips the in-memory cache while NODE_ENV is development", () => {
    expect.hasAssertions()
    vi.stubEnv("NODE_ENV", "development")

    try {
      const firstLoad = loadLocaleMessagesFromDir("en-US", MERGE_FIXTURE)
      const secondLoad = loadLocaleMessagesFromDir("en-US", MERGE_FIXTURE)

      expect(firstLoad).toStrictEqual(secondLoad)
      expect(firstLoad.pages).toBeDefined()
    } finally {
      vi.unstubAllEnvs()
    }
  })
})
