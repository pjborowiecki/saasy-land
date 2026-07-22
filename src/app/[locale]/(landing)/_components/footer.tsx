import { type JSX, Suspense } from "react"

import { Rocket } from "lucide-react"

import { FooterCopyright } from "~/src/app/[locale]/(landing)/_components/footer-copyright"
import { APP_NAME } from "~/src/presentation/branding"

export function Footer(): JSX.Element {
  return (
    <footer className="relative z-10 bg-background pt-20 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <Rocket className="size-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">{APP_NAME}</span>
            <Suspense>
              <FooterCopyright />
            </Suspense>
          </div>
        </div>
      </div>
    </footer>
  )
}
