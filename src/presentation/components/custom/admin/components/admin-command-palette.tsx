import { type JSX, useCallback, useEffect, useState } from "react"

import { useRouter } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { useTranslations } from "use-intl/react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/src/presentation/components/shadcn/command"
import { Kbd, KbdGroup } from "~/src/presentation/components/shadcn/kbd"

import { SIDEBAR_CONFIG, type SidebarNavItem } from "~/src/presentation/components/custom/admin/constants/sidebar"

interface CommandDestinationProps {
  readonly item: SidebarNavItem
  readonly label: string
  readonly onNavigate: (url: string) => void
}

/**
 * One destination. The handler lives here so the callback identity is stable per row: an arrow
 * created inside the parent's map would be a new function on every keystroke in the search
 * field, and this list re-renders on every keystroke by design.
 */
const CommandDestination = ({ item, label, onNavigate }: CommandDestinationProps): JSX.Element => {
  const handleAction = useCallback((): void => {
    onNavigate(item.url)
  }, [item.url, onNavigate])

  return (
    <CommandItem className="gap-2.5" onAction={handleAction} textValue={label}>
      <item.icon aria-hidden className="size-4 text-muted-foreground" strokeWidth={1.5} />
      {label}
    </CommandItem>
  )
}

/**
 * The console's search is a real command palette, not an input that does nothing.
 *
 * The header used to render a decorative search field with a ⌘K hint beside it and no handler
 * anywhere. A control that advertises a keyboard shortcut and then ignores it is worse than no
 * control: it teaches the visitor that the chrome is a picture. This one navigates.
 *
 * The destination list is `SIDEBAR_CONFIG`, so the palette and the rail can never disagree about
 * what the console contains, and a new section appears in both the moment it is added to one.
 */
export const AdminCommandPalette = (): JSX.Element => {
  const t = useTranslations("pages.admin.components.header")
  const tSidebar = useTranslations("pages.admin.sidebar")
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        // The browser owns ⌘K in some contexts (the address bar in Firefox); this is a
        // Console, the visitor is inside an application, and the application takes it.
        event.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const open = useCallback((): void => {
    setIsOpen(true)
  }, [])

  const navigate = useCallback(
    (url: string): void => {
      setIsOpen(false)
      void router.navigate({ to: url })
    },
    [router],
  )

  return (
    <>
      <button
        className="group flex h-8 items-center gap-2 rounded-lg border border-border bg-muted/40 pr-1.5 pl-2.5 text-body-sm text-muted-foreground transition-colors duration-200 ease-exp hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onClick={open}
        type="button"
      >
        <Search aria-hidden className="size-3.5" strokeWidth={1.75} />
        <span className="hidden sm:inline">{t("searchPlaceholder")}</span>
        <KbdGroup className="ml-6 hidden sm:inline-flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </button>

      <CommandDialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <Command>
          <CommandInput placeholder={t("searchPlaceholder")} />
          <CommandList className="max-h-80">
            <CommandEmpty className="text-muted-foreground">{t("searchEmpty")}</CommandEmpty>
            {SIDEBAR_CONFIG.map((group) => (
              <CommandGroup heading={tSidebar(`groups.${group.titleKey}`)} key={group.titleKey}>
                {group.items.map((item) => (
                  <CommandDestination item={item} key={item.titleKey} label={tSidebar(`links.${item.titleKey}`)} onNavigate={navigate} />
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
