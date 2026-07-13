---
name: tanstack-devtools
description: Centralized, extensible devtools panel for TanStack libraries with a plugin architecture.
---


## Overview

TanStack Devtools provides a unified debugging interface that consolidates devtools for TanStack Query, Router, and other libraries into a single panel. It features a framework-agnostic plugin architecture, real-time state inspection, and support for custom plugins. Built with Solid.js for lightweight performance.

**React:** `@tanstack/react-devtools`
**Core:** `@tanstack/devtools`
**Status:** Alpha

## Installation

```bash
npm install @tanstack/react-devtools
```

## Basic Setup

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TanStackDevtools />
      {/* Your app content */}
      <MyApp />
    </QueryClientProvider>
  )
}
```

## Built-in Plugins

### Query Devtools

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TanStackDevtools
        plugins={[
          {
            id: 'react-query',
            name: 'React Query',
            render: () => <ReactQueryDevtoolsPanel />,
          },
        ]}
      />
      <MyApp />
    </QueryClientProvider>
  )
}
```

### Router Devtools

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

function App() {
  return (
    <TanStackDevtools
      plugins={[
        {
          id: 'router',
          name: 'Router',
          render: () => <TanStackRouterDevtoolsPanel router={router} />,
        },
      ]}
    />
  )
}
```

### Combined Setup

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TanStackDevtools
        plugins={[
          {
            id: 'react-query',
            name: 'React Query',
            render: () => <ReactQueryDevtoolsPanel />,
          },
          {
            id: 'router',
            name: 'Router',
            render: () => <TanStackRouterDevtoolsPanel router={router} />,
          },
        ]}
      />
      <MyApp />
    </QueryClientProvider>
  )
}
```

### AI Devtools

For debugging TanStack AI workflows:

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'
import { AIDevtoolsPanel } from '@tanstack/ai-react/devtools'

function App() {
  return (
    <TanStackDevtools
      plugins={[
        {
          id: 'ai',
          name: 'AI',
          render: () => <AIDevtoolsPanel />,
        },
      ]}
    />
  )
}
```

AI Devtools features:
- **Message Inspector** - View full conversation history with metadata
- **Token Usage** - Track input/output tokens and costs per request
- **Streaming Visualization** - Real-time view of streaming chunks
- **Tool Call Debugging** - Inspect tool calls, parameters, and results
- **Thinking/Reasoning Viewer** - Debug reasoning tokens from thinking models
- **Adapter Switching** - Test different providers in development

## Plugin System

### Plugin Interface

```typescript
interface DevtoolsPlugin {
  id: string          // Unique identifier
  name: string        // Display name in the devtools panel
  render: () => JSX.Element  // React component to render
}
```

### Custom Plugins

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'

// Custom state inspector plugin
const stateInspectorPlugin = {
  id: 'state-inspector',
  name: 'State',
  render: () => (
    <div style={{ padding: '16px' }}>
      <h3>Application State</h3>
      <pre>{JSON.stringify(appState, null, 2)}</pre>
    </div>
  ),
}

// Custom network logger plugin
const networkLoggerPlugin = {
  id: 'network-logger',
  name: 'Network',
  render: () => <NetworkLoggerPanel />,
}

function App() {
  return (
    <TanStackDevtools
      plugins={[
        stateInspectorPlugin,
        networkLoggerPlugin,
      ]}
    />
  )
}
```

### Dynamic Plugin Registration

```tsx
function App() {
  const [plugins, setPlugins] = useState<DevtoolsPlugin[]>([])

  useEffect(() => {
    // Register plugins conditionally
    const activePlugins: DevtoolsPlugin[] = []

    if (process.env.NODE_ENV === 'development') {
      activePlugins.push({
        id: 'debug',
        name: 'Debug',
        render: () => <DebugPanel />,
      })
    }

    setPlugins(activePlugins)
  }, [])

  return <TanStackDevtools plugins={plugins} />
}
```

## Vite Plugin Integration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackDevtools } from '@tanstack/devtools/vite'

export default defineConfig({
  plugins: [
    tanstackDevtools(),
  ],
})
```

## Production Considerations

```tsx
// Only include devtools in development
function App() {
  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <TanStackDevtools plugins={plugins} />
      )}
      <MyApp />
    </>
  )
}

// Or use lazy loading
const TanStackDevtools = lazy(() =>
  import('@tanstack/react-devtools').then((m) => ({ default: m.TanStackDevtools }))
)
```

## Framework Support

| Framework | Package | Status |
|-----------|---------|--------|
| React | `@tanstack/react-devtools` | Alpha |
| Solid | `@tanstack/solid-devtools` | Planned |
| Vue | `@tanstack/vue-devtools` | Planned |
| Angular | `@tanstack/angular-devtools` | Planned |

## Features

- **Unified Panel** - Single interface for all TanStack debugging
- **Real-time Updates** - Live monitoring of state changes
- **Plugin Architecture** - Extensible with custom and third-party plugins
- **Built-in Plugins** - Query, Router, and AI devtools panels
- **Lightweight** - Built with Solid.js for minimal overhead
- **Type-safe** - Full TypeScript support for plugin definitions
- **Framework-agnostic Core** - Plugin logic works across frameworks

## Best Practices

1. **Conditionally include in production** - use environment checks or code splitting
2. **Use specific plugins** rather than loading all available ones
3. **Give plugins unique IDs** to prevent conflicts
4. **Keep plugin render functions lightweight** - avoid expensive computations
5. **Use the Vite plugin** for automatic setup in Vite-based projects
6. **Combine Query + Router + AI plugins** for full-stack TanStack debugging
7. **Create domain-specific plugins** for app-level state inspection
8. **Use AI devtools** when debugging streaming, tool calls, or token usage

## Common Pitfalls

- Including devtools in production builds without tree-shaking
- Using duplicate plugin IDs (causes rendering conflicts)
- Heavy render functions in plugins (slows down the devtools panel)
- Forgetting to wrap with QueryClientProvider when using Query plugin
- Not passing the router instance to Router devtools panel
