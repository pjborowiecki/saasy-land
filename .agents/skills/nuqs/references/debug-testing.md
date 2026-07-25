---
title: Test Components with URL State
impact: LOW-MEDIUM
impactDescription: enables reliable CI/CD testing of nuqs components
tags: debug, testing, jest, vitest, react-testing-library
---

## Test Components with URL State

Test components that use nuqs by providing the NuqsTestingAdapter and controlling URL state in tests.

**Incorrect (test fails without adapter):**

```tsx
// components/Pagination.test.tsx
import { render, screen } from '@testing-library/react'
import Pagination from './Pagination'

it('displays current page', () => {
  render(<Pagination />) // Fails: no NuqsAdapter
  expect(screen.getByText('Page 1')).toBeInTheDocument()
})
```

**Correct (use NuqsTestingAdapter):**

```tsx
// test/utils.tsx
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { render, type RenderOptions } from '@testing-library/react'

export function renderWithNuqs(
  ui: React.ReactElement,
  { searchParams = {}, ...options }: RenderOptions & { searchParams?: Record<string, string> } = {}
) {
  return render(
    <NuqsTestingAdapter searchParams={searchParams}>
      {ui}
    </NuqsTestingAdapter>,
    options
  )
}

// components/Pagination.test.tsx
import { screen } from '@testing-library/react'
import { renderWithNuqs } from '@/test/utils'
import Pagination from './Pagination'

it('displays current page from URL', () => {
  renderWithNuqs(<Pagination />, { searchParams: { page: '5' } })
  expect(screen.getByText('Page 5')).toBeInTheDocument()
})
```

Reference: [nuqs Testing Adapter](https://nuqs.dev/docs/testing)
