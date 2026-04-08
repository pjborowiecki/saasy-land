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

const img: MDXComponents["img"] = (props) => {
  const { src, ...rest } = props as ComponentPropsWithoutRef<"img">
  if (typeof src !== "string") return null
  return <ImageZoom {...rest} src={src} />
}

const defaultMDXComponents: MDXComponents = {
  ...defaultMdxComponents,
  Accordion,
  Accordions,
  Banner,
  File,
  Files,
  Folder,
  TypeTable,
  Step,
  Steps,
  Tab,
  Tabs,
  pre,
  img,
}

export function getMDXComponents(customMDXComponents?: MDXComponents): MDXComponents {
  return { ...defaultMDXComponents, ...customMDXComponents }
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProviderComponents = ReturnType<typeof getMDXComponents>
}
