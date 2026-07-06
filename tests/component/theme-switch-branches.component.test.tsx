/** @vitest-environment jsdom */

import { createElement, type ComponentProps } from "react"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import type * as ShadcnSelect from "~/src/components/shadcn/select"

import { ThemeSwitchClient } from "~/src/components/custom/theme-switch"

import { setThemeMock, themeState } from "~/tests/mocks/wrksz-themes"

type ThemeSelectOnValueChange = (value: string | null) => void

const themeChangeHandler = vi.hoisted((): { current?: ThemeSelectOnValueChange } => ({}))

vi.mock(import("~/src/components/shadcn/select"), async (importOriginal): Promise<Partial<typeof ShadcnSelect>> => {
  const actual = await importOriginal<typeof ShadcnSelect>()

  function Select(props: ComponentProps<typeof actual.Select>) {
    if (props.onValueChange) {
      themeChangeHandler.current = (value) => {
        props.onValueChange?.(value, {} as Parameters<NonNullable<typeof props.onValueChange>>[1])
      }
    }

    return createElement(actual.Select, props)
  }

  return { ...actual, Select: Select as typeof actual.Select }
})

const themeSwitchLabels = {
  darkLabel: "Dark",
  label: "Theme",
  lightLabel: "Light",
  placeholder: "Select",
  systemLabel: "System",
} as const

describe("themeSwitchClient branches", () => {
  it("shows the placeholder when theme is undefined", async () => {
    expect.hasAssertions()
    setThemeMock.mockClear()
    themeState.value = void 0

    render(<ThemeSwitchClient {...themeSwitchLabels} />)

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveTextContent(themeSwitchLabels.placeholder)
    })
  })

  it("does not update theme when the select is opened without a selection", async () => {
    expect.hasAssertions()
    setThemeMock.mockClear()
    themeState.value = "light"
    const user = userEvent.setup()

    render(<ThemeSwitchClient {...themeSwitchLabels} />)

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("combobox"))
    expect(setThemeMock).not.toHaveBeenCalled()
  })

  it("ignores null and invalid theme values from onValueChange", async () => {
    expect.hasAssertions()
    setThemeMock.mockClear()
    themeState.value = "light"

    render(<ThemeSwitchClient {...themeSwitchLabels} />)

    await waitFor(() => {
      expect(themeChangeHandler.current).toBeDefined()
    })

    themeChangeHandler.current?.(null)
    themeChangeHandler.current?.("invalid-theme")
    expect(setThemeMock).not.toHaveBeenCalled()
  })
})
