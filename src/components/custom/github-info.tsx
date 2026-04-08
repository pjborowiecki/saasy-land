"use client"

import type { JSX } from "react"
import { Suspense } from "react"

import { GithubInfo } from "fumadocs-ui/components/github-info"

import { Skeleton } from "~/src/components/shadcn/skeleton"

type CustomGithubInfoProps = Readonly<{
  owner: string
  repo: string
}>

function GithubInfoSkeleton({ owner, repo }: CustomGithubInfoProps): JSX.Element {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg p-2">
      <div className="flex items-center gap-2 truncate">
        <Skeleton aria-hidden className="size-3.5 rounded" />
        <Skeleton aria-hidden className="h-4 w-40 rounded" />
      </div>
      <div className="flex items-center gap-2 text-fd-muted-foreground text-xs">
        <Skeleton aria-hidden className="h-3 w-10 rounded" />
        <Skeleton aria-hidden className="h-3 w-10 rounded" />
      </div>
      <span className="sr-only">
        {owner}/{repo}
      </span>
    </div>
  )
}

export function CustomGithubInfo({ owner, repo }: CustomGithubInfoProps): JSX.Element {
  return (
    <Suspense fallback={<GithubInfoSkeleton owner={owner} repo={repo} />}>
      <GithubInfo owner={owner} repo={repo} />
    </Suspense>
  )
}
