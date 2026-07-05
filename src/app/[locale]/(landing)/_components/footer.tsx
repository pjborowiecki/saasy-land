import { Suspense, type JSX } from "react"

import { Rocket } from "lucide-react"

import { CONSTANTS } from "~/src/constants"

import { FooterCopyright } from "~/src/app/[locale]/(landing)/_components/footer-copyright"

const footerCopyrightFallback = <span className="ml-2 text-xs text-muted-foreground">©</span>

export function Footer(): JSX.Element {
  return (
    <footer className="relative z-10 bg-background pt-20 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <Rocket className="size-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">{CONSTANTS.APP_NAME}</span>
            <Suspense fallback={footerCopyrightFallback}>
              <FooterCopyright />
            </Suspense>
          </div>
        </div>
      </div>
    </footer>
  )
}
