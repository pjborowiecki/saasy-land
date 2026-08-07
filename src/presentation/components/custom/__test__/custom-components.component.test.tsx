/** @vitest-environment jsdom */

import type * as NextDynamic from "next/dynamic"
import type { ComponentType } from "react"

import { render, screen } from "@testing-library/react"

import { Background, backgroundGridPatternClassName } from "~/src/presentation/components/custom/background"
import { GithubInfo } from "~/src/presentation/components/custom/github-info"
import { HtmlLang } from "~/src/presentation/components/custom/html-lang"
import { Github, Google, Icons } from "~/src/presentation/components/custom/icons"
import {
  Blockquote,
  H1,
  H2,
  H3,
  H4,
  InlineCode,
  Large,
  Lead,
  List,
  Muted,
  P,
  Prose,
  Small,
  TableWrap,
} from "~/src/presentation/components/custom/typography"
import { VercelObservability } from "~/src/presentation/components/custom/vercel-observability"

const DYNAMIC_STUB_COUNT = 2

vi.mock(import("next/dynamic"), async (): Promise<Partial<typeof NextDynamic>> => {
  const { createElement } = await import("react")

  function dynamicDefault<P>(
    dynamicOptions: NextDynamic.Loader<P> | NextDynamic.DynamicOptions<P>,
    _options?: NextDynamic.DynamicOptions<P>,
  ): ComponentType<P> {
    if (typeof dynamicOptions === "function") {
      void dynamicOptions()
    } else if ("loader" in dynamicOptions && typeof dynamicOptions.loader === "function") {
      void dynamicOptions.loader()
    }

    return function DynamicStub() {
      return createElement("div", { "data-testid": "dynamic-stub" })
    }
  }

  return { default: dynamicDefault }
})

describe("background helper", () => {
  it("renders grid and glow by default", () => {
    expect.hasAssertions()
    const { container } = render(<Background className="test-grid" />)
    expect(container.querySelector(".test-grid")).toHaveClass(backgroundGridPatternClassName)
    expect(container.querySelector(String.raw`.bg-primary\/10`)).toBeInTheDocument()
  })

  it("can hide glow", () => {
    expect.hasAssertions()
    const { container } = render(<Background glow={false} />)
    expect(container.querySelector(String.raw`.bg-primary\/10`)).not.toBeInTheDocument()
  })
})

describe("icons helper", () => {
  it("renders github and google icons", () => {
    expect.hasAssertions()
    render(
      <div>
        <Github className="github-icon" />
        <Google className="google-icon" />
      </div>,
    )
    expect(document.querySelector(".github-icon")).toBeInTheDocument()
    expect(document.querySelector(".google-icon")).toBeInTheDocument()
    expect(Icons.Github).toBe(Github)
  })
})

describe("github info component", () => {
  it("links to the repository", () => {
    expect.hasAssertions()
    render(<GithubInfo owner="acme" repo="app" />)
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://github.com/acme/app")
  })
})

describe("html lang component", () => {
  it("sets documentElement.lang on mount", () => {
    expect.hasAssertions()
    document.documentElement.lang = "en"
    render(<HtmlLang locale="pl-PL" />)
    expect(document.documentElement.lang).toBe("pl-PL")
  })

  it("updates documentElement.lang when locale changes", () => {
    expect.hasAssertions()
    document.documentElement.lang = "en"
    const view = render(<HtmlLang locale="en-US" />)
    expect(document.documentElement.lang).toBe("en-US")

    view.rerender(<HtmlLang locale="pl-PL" />)
    expect(document.documentElement.lang).toBe("pl-PL")
  })
})

describe("typography components", () => {
  it("renders semantic elements", () => {
    expect.hasAssertions()
    render(
      <div>
        <H1>Heading 1</H1>
        <H2>Heading 2</H2>
        <H3>Heading 3</H3>
        <H4>Heading 4</H4>
        <P>Paragraph</P>
        <Lead>Lead</Lead>
        <Large>Large</Large>
        <Small>Small</Small>
        <Muted>Muted</Muted>
        <Blockquote>Quote</Blockquote>
        <InlineCode>code</InlineCode>
        <List>
          <li>Item</li>
        </List>
        <TableWrap>
          <table>
            <tbody>
              <tr>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
        <Prose>
          <p>Prose</p>
        </Prose>
      </div>,
    )

    expect(screen.getByText("Heading 1").tagName).toBe("H1")
    expect(screen.getByText("Paragraph").tagName).toBe("P")
    expect(screen.getByText("Quote").tagName).toBe("BLOCKQUOTE")
    expect(screen.getByText("code").tagName).toBe("CODE")
    expect(screen.getByText("Cell").tagName).toBe("TD")
  })
})

describe("vercel observability component", () => {
  it("renders analytics and speed insights stubs", () => {
    expect.hasAssertions()
    render(<VercelObservability />)
    expect(screen.getAllByTestId("dynamic-stub")).toHaveLength(DYNAMIC_STUB_COUNT)
  })
})
