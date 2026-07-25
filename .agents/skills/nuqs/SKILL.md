---
name: nuqs
description: nuqs (type-safe URL query state) best practices for Next.js and other React frameworks. This skill should be used when writing, reviewing, or refactoring code that uses nuqs for URL state management. Triggers on tasks involving useQueryState, useQueryStates, search params, URL state, query parameters, nuqs parsers, limitUrlUpdates, Standard Schema, NuqsAdapter, or Next.js routing with state.
---

# Community nuqs Best Practices for Next.js & React

Comprehensive guide for type-safe URL query state management with nuqs across Next.js, React Router, TanStack Router, Remix, and plain React. Covers nuqs v2.5–v2.9 features. Contains 39 rules across 8 categories, prioritized by impact to guide code generation, refactoring, and code review.

## When to Apply

Reference these guidelines when:
- Implementing URL-based state with nuqs
- Setting up nuqs in a Next.js or React Router project
- Configuring parsers for URL parameters
- Integrating URL state with Server Components
- Optimizing URL update performance (`limitUrlUpdates`, key isolation)
- Sharing parser definitions with tRPC / TanStack Router / forms via Standard Schema
- Debugging nuqs-related issues

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Parser Configuration | CRITICAL | `parser-` |
| 2 | Adapter & Setup | CRITICAL | `setup-` |
| 3 | State Management | HIGH | `state-` |
| 4 | Server Integration | HIGH | `server-` |
| 5 | Performance Optimization | MEDIUM | `perf-` |
| 6 | History & Navigation | MEDIUM | `history-` |
| 7 | Debugging & Testing | LOW-MEDIUM | `debug-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

## Quick Reference

### 1. Parser Configuration (CRITICAL)

- [`parser-use-typed-parsers`](references/parser-use-typed-parsers.md) — Use typed parsers for non-string values
- [`parser-with-default`](references/parser-with-default.md) — Use withDefault for non-nullable state
- [`parser-enum-validation`](references/parser-enum-validation.md) — Use enum parsers for constrained values
- [`parser-array-format`](references/parser-array-format.md) — Choose correct array parser format
- [`parser-json-validation`](references/parser-json-validation.md) — Validate JSON parser input
- [`parser-date-format`](references/parser-date-format.md) — Select appropriate date parser
- [`parser-index-offset`](references/parser-index-offset.md) — Use parseAsIndex for 1-based URL display

### 2. Adapter & Setup (CRITICAL)

- [`setup-nuqs-adapter`](references/setup-nuqs-adapter.md) — Wrap app with NuqsAdapter
- [`setup-use-client`](references/setup-use-client.md) — Add 'use client' directive for hooks
- [`setup-import-server`](references/setup-import-server.md) — Import server utilities from nuqs/server
- [`setup-nextjs-version`](references/setup-nextjs-version.md) — Ensure compatible Next.js version
- [`setup-shared-parsers`](references/setup-shared-parsers.md) — Define shared parsers in dedicated file
- [`setup-default-options`](references/setup-default-options.md) — Configure app-wide defaults on NuqsAdapter (v2.5+)

### 3. State Management (HIGH)

- [`state-use-query-states`](references/state-use-query-states.md) — Use useQueryStates for related parameters
- [`state-clear-with-null`](references/state-clear-with-null.md) — Clear URL parameters with null
- [`state-avoid-derived`](references/state-avoid-derived.md) — Avoid derived state from URL parameters
- [`state-options-inheritance`](references/state-options-inheritance.md) — Use withOptions for parser-level configuration
- [`state-setter-return`](references/state-setter-return.md) — Use setter return value for URL access
- [`state-standard-schema`](references/state-standard-schema.md) — Use Standard Schema for cross-library validation (v2.5+)

### 4. Server Integration (HIGH)

- [`server-search-params-cache`](references/server-search-params-cache.md) — Use createSearchParamsCache (or createLoader) for Server Components
- [`server-shallow-false`](references/server-shallow-false.md) — Use shallow:false to trigger server re-renders
- [`server-use-transition`](references/server-use-transition.md) — Integrate useTransition for loading states
- [`server-parse-before-get`](references/server-parse-before-get.md) — Call parse() before get() in Server Components
- [`server-next15-async`](references/server-next15-async.md) — Handle async searchParams in Next.js 15+

### 5. Performance Optimization (MEDIUM)

- [`perf-throttle-updates`](references/perf-throttle-updates.md) — Throttle rapid URL updates with `limitUrlUpdates`
- [`perf-debounce-search`](references/perf-debounce-search.md) — Debounce search input with built-in `limitUrlUpdates`
- [`perf-clear-on-default`](references/perf-clear-on-default.md) — Use clearOnDefault for clean URLs
- [`perf-avoid-rerender`](references/perf-avoid-rerender.md) — Memoize components using URL state (Next.js)
- [`perf-key-isolation`](references/perf-key-isolation.md) — Rely on key isolation outside Next.js (v2.5+)
- [`perf-serialize-utility`](references/perf-serialize-utility.md) — Use createSerializer for link URLs

### 6. History & Navigation (MEDIUM)

- [`history-push-navigation`](references/history-push-navigation.md) — Choose history:push vs history:replace
- [`history-scroll-behavior`](references/history-scroll-behavior.md) — Control scroll behavior on URL changes

### 7. Debugging & Testing (LOW-MEDIUM)

- [`debug-enable-logging`](references/debug-enable-logging.md) — Enable debug logging for troubleshooting
- [`debug-testing`](references/debug-testing.md) — Test components with URL state

### 8. Advanced Patterns (LOW)

- [`advanced-custom-parsers`](references/advanced-custom-parsers.md) — Create custom parsers for complex types
- [`advanced-url-keys`](references/advanced-url-keys.md) — Use urlKeys for shorter URLs
- [`advanced-eq-function`](references/advanced-eq-function.md) — Implement eq function for object parsers
- [`advanced-framework-adapters`](references/advanced-framework-adapters.md) — Use framework-specific adapters
- [`advanced-process-url-search-params`](references/advanced-process-url-search-params.md) — Canonicalize URL shape with `processUrlSearchParams` (v2.6+)

## How to Use

Read individual reference files for detailed explanations and code examples:

- [Section definitions](references/_sections.md) — Category structure and impact levels
- [Rule template](assets/templates/_template.md) — Template for adding new rules

## Reference Files

| File | Description |
|------|-------------|
| [AGENTS.md](AGENTS.md) | Complete compiled guide with all rules |
| [references/_sections.md](references/_sections.md) | Category definitions and ordering |
| [assets/templates/_template.md](assets/templates/_template.md) | Template for new rules |
| [metadata.json](metadata.json) | Version and reference information |
