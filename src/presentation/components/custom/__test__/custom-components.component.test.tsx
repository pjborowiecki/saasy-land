import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vite-plus/test"
/** @vitest-environment jsdom */

import { Background, backgroundGridPatternClassName } from "~/src/presentation/components/custom/background"
import { GithubInfo } from "~/src/presentation/components/custom/github-info"
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
  Paragraph,
  Prose,
  Small,
  TableWrap,
} from "~/src/presentation/components/custom/typography"
import { Wordmark } from "~/src/presentation/components/custom/wordmark"

import { APP_NAME } from "~/src/presentation/branding"

describe("background helper", () => {
  it("renders grid and signal by default", () => {
    expect.hasAssertions()
    const { container } = render(<Background className="test-grid" />)
    expect(container.querySelector(".test-grid")).toHaveClass(backgroundGridPatternClassName)
    // The wash is the accent token, not a tint of primary: primary is monochrome in this palette.
    expect(container.querySelector(".field-signal")).toBeInTheDocument()
  })

  it("can hide the signal", () => {
    expect.hasAssertions()
    const { container } = render(<Background glow={false} />)
    expect(container.querySelector(".field-signal")).not.toBeInTheDocument()
  })
})

describe("wordmark", () => {
  it("renders the mark beside the product name", () => {
    expect.hasAssertions()
    const { container } = render(<Wordmark className="test-wordmark" />)
    expect(container.querySelector(".test-wordmark")).toBeInTheDocument()
    expect(screen.getByText(APP_NAME)).toBeInTheDocument()
    expect(container.querySelector("svg")).toBeInTheDocument()
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

describe("typography components", () => {
  it("renders semantic elements", () => {
    expect.hasAssertions()
    render(
      <div>
        <H1>Heading 1</H1>
        <H2>Heading 2</H2>
        <H3>Heading 3</H3>
        <H4>Heading 4</H4>
        <Paragraph>Paragraph</Paragraph>
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
