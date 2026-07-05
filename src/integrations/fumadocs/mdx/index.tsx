import type { ComponentProps, ComponentPropsWithoutRef } from "react"

import { Accordion, Accordions } from "fumadocs-ui/components/accordion"
import { Banner } from "fumadocs-ui/components/banner"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { File, Files, Folder } from "fumadocs-ui/components/files"
import { ImageZoom } from "fumadocs-ui/components/image-zoom"
import { Step, Steps } from "fumadocs-ui/components/steps"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { TypeTable } from "fumadocs-ui/components/type-table"
import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"

const pre = ({ ref: _ref, ...props }: ComponentProps<typeof CodeBlock>) => (
  <CodeBlock {...props}>
    <Pre>{props.children}</Pre>
  </CodeBlock>
)

const EMPTY_ALT_LENGTH = 0

function isImgProps(value: unknown): value is ComponentPropsWithoutRef<"img"> {
  return typeof value === "object" && value !== null
}

const img: MDXComponents["img"] = (props) => {
  if (!isImgProps(props)) {
    return
  }

  const { alt, src } = props

  if (typeof src !== "string") {
    return
  }

  if (typeof alt === "string" && alt.length > EMPTY_ALT_LENGTH) {
    return <ImageZoom src={src} alt={alt} />
  }

  return <ImageZoom src={src} />
}

const defaultMDXComponents: MDXComponents = {
  ...defaultMdxComponents,
  Accordion,
  Accordions,
  Banner,
  File,
  Files,
  Folder,
  Step,
  Steps,
  Tab,
  Tabs,
  TypeTable,
  img,
  pre,
}

export function getMDXComponents(customMDXComponents?: MDXComponents): MDXComponents {
  return { ...defaultMDXComponents, ...customMDXComponents }
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProviderComponents = ReturnType<typeof getMDXComponents>
}
