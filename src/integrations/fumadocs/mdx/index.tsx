import { type ComponentProps, type ComponentPropsWithoutRef, createContext, useContext } from "react"

import { useRouterState } from "@tanstack/react-router"
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

import { resolveDocsRelativeHref } from "~/src/integrations/fumadocs/resolve-docs-href"

import { Alert, AlertDescription, AlertTitle } from "~/src/presentation/components/shadcn/alert"
import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as ShadcnCard,
} from "~/src/presentation/components/shadcn/card"
import { Separator } from "~/src/presentation/components/shadcn/separator"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/src/presentation/components/shadcn/table"

const pre = ({ ref: _ref, ...props }: ComponentProps<typeof CodeBlock>) => (
  <CodeBlock {...props}>
    <Pre>{props.children}</Pre>
  </CodeBlock>
)

export const MdxSourcePath = createContext<string | undefined>(undefined)

const EMPTY_ALT_LENGTH = 0

const MdxLink = ({ href, ...props }: ComponentPropsWithoutRef<"a">) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const sourcePath = useContext(MdxSourcePath)
  const Anchor = defaultMdxComponents.a
  const resolved = href === undefined ? undefined : resolveDocsRelativeHref({ href, pathname, sourcePath })
  return <Anchor {...props} {...(resolved === undefined ? {} : { href: resolved })} />
}

const isImgProps = (value: unknown): value is ComponentPropsWithoutRef<"img"> => typeof value === "object" && value !== null

const img: MDXComponents["img"] = (props) => {
  if (!isImgProps(props)) {
    return false
  }

  const { alt, src } = props

  if (typeof src !== "string") {
    return false
  }

  if (typeof alt === "string" && alt.length > EMPTY_ALT_LENGTH) {
    return <ImageZoom src={src} alt={alt} />
  }

  return <ImageZoom src={src} />
}

/**
 * MDX component map for docs/blog.
 * Prefer Fumadocs primitives (Cards, Callout, Steps, Tabs, Accordions) for doc UX;
 * shadcn exports are available when you need product-UI parity.
 */
const defaultMDXComponents: MDXComponents = {
  ...defaultMdxComponents,
  Accordion,
  Accordions,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Banner,
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  File,
  Files,
  Folder,
  Separator,
  // Shadcn Card namespaced — collides with Fumadocs Card
  ShadcnCard,
  Step,
  Steps,
  Tab,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TypeTable,
  a: MdxLink,
  img,
  pre,
}

export const getMDXComponents = (customMDXComponents?: MDXComponents): MDXComponents => ({
  ...defaultMDXComponents,
  ...customMDXComponents,
})

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProviderComponents = ReturnType<typeof getMDXComponents>
}
