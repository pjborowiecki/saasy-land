# nuqs

**Version 1.2.0**  
Community  
July 2026

---

## Abstract

Comprehensive best practices guide for nuqs (type-safe URL query state management) in Next.js and other React frameworks, designed for AI agents and LLMs. Covers nuqs v2.5–v2.9 features including limitUrlUpdates (built-in debounce/throttle), key isolation, Standard Schema integration, defaultOptions on NuqsAdapter (with history added in v2.9), processUrlSearchParams middleware (adapter and createSerializer), the createLoader server utility, the React Router v8 adapter, and Next.js 16 cacheComponents compatibility. Contains 39 rules across 8 categories, prioritized by impact from critical (parser configuration, adapter setup) to incremental (advanced patterns). Each rule names the wrong default it corrects, with realistic examples and, where relevant, honest consequence-based impact notes to guide automated refactoring and code generation.

---

## Table of Contents

1. [Parser Configuration](references/_sections.md#1-parser-configuration) — **CRITICAL**
   - 1.1 [Choose Correct Array Parser Format](references/parser-array-format.md) — CRITICAL (prevents API integration failures from wrong URL format)
   - 1.2 [Select Appropriate Date Parser](references/parser-date-format.md) — CRITICAL (prevents timezone bugs and parsing failures)
   - 1.3 [Use Enum Parsers for Constrained Values](references/parser-enum-validation.md) — CRITICAL (prevents invalid state from URL manipulation)
   - 1.4 [Use parseAsIndex for 1-Based URL Display](references/parser-index-offset.md) — HIGH (eliminates off-by-one errors between URL and code)
   - 1.5 [Use Typed Parsers for Non-String Values](references/parser-use-typed-parsers.md) — CRITICAL (prevents runtime type errors and hydration mismatches)
   - 1.6 [Use withDefault for Non-Nullable State](references/parser-with-default.md) — CRITICAL (eliminates null checks throughout component tree)
   - 1.7 [Validate JSON Parser Input](references/parser-json-validation.md) — CRITICAL (prevents runtime crashes and unsafe casts from URL-supplied JSON)
2. [Adapter & Setup](references/_sections.md#2-adapter-&-setup) — **CRITICAL**
   - 2.1 [Add 'use client' Directive for Hooks](references/setup-use-client.md) — CRITICAL (prevents build-breaking hook errors in RSC)
   - 2.2 [Configure App-Wide Defaults on NuqsAdapter](references/setup-default-options.md) — MEDIUM (avoids repeating .withOptions on every parser; enforces consistent behaviour)
   - 2.3 [Define Shared Parsers in Dedicated File](references/setup-shared-parsers.md) — HIGH (prevents parser mismatch bugs between components)
   - 2.4 [Ensure Compatible Next.js Version](references/setup-nextjs-version.md) — CRITICAL (prevents cryptic runtime errors from version mismatch)
   - 2.5 [Import Server Utilities from nuqs/server](references/setup-import-server.md) — CRITICAL (prevents RSC-to-client boundary contamination errors)
   - 2.6 [Wrap App with NuqsAdapter](references/setup-nuqs-adapter.md) — CRITICAL (prevents 100% of hook failures from missing provider)
3. [State Management](references/_sections.md#3-state-management) — **HIGH**
   - 3.1 [Avoid Derived State from URL Parameters](references/state-avoid-derived.md) — HIGH (prevents sync bugs and unnecessary re-renders)
   - 3.2 [Clear URL Parameters with null](references/state-clear-with-null.md) — HIGH (reduces URL clutter by removing unnecessary parameters)
   - 3.3 [Use Setter Return Value for URL Access](references/state-setter-return.md) — MEDIUM (enables accurate URL tracking for analytics/sharing without re-deriving the URL)
   - 3.4 [Use Standard Schema for Cross-Library Validation](references/state-standard-schema.md) — MEDIUM (one parser map validates nuqs, tRPC, route validators, and forms — no duplicated schema)
   - 3.5 [Use useQueryStates for Related Parameters](references/state-use-query-states.md) — HIGH (gives a single typed object and one combined URLSearchParams flush)
   - 3.6 [Use withOptions for Parser-Level Configuration](references/state-options-inheritance.md) — MEDIUM (reduces boilerplate and ensures consistent behavior)
4. [Server Integration](references/_sections.md#4-server-integration) — **HIGH**
   - 4.1 [Call parse() Before get() in Server Components](references/server-parse-before-get.md) — HIGH (prevents undefined values and runtime errors)
   - 4.2 [Handle Async searchParams in Next.js 15+](references/server-next15-async.md) — HIGH (prevents build errors in Next.js 15 with async props)
   - 4.3 [Integrate useTransition for Loading States](references/server-use-transition.md) — HIGH (exposes pending state for non-shallow server fetches so the UI can show loading)
   - 4.4 [Use createSearchParamsCache for Server Components](references/server-search-params-cache.md) — HIGH (eliminates prop drilling across N component levels)
   - 4.5 [Use shallow:false to Trigger Server Re-renders](references/server-shallow-false.md) — HIGH (enables server-side data refetching on URL change)
5. [Performance Optimization](references/_sections.md#5-performance-optimization) — **MEDIUM**
   - 5.1 [Debounce Search Input Before URL Update](references/perf-debounce-search.md) — HIGH (reduces server requests during typing from N per keystroke to 1 per pause)
   - 5.2 [Memoize Components Using URL State](references/perf-avoid-rerender.md) — MEDIUM (prevents unnecessary re-renders on URL changes (Next.js especially))
   - 5.3 [Rely on Key Isolation Outside Next.js](references/perf-key-isolation.md) — HIGH (avoids unnecessary memoization on adapters that already scope re-renders per key)
   - 5.4 [Throttle Rapid URL Updates](references/perf-throttle-updates.md) — MEDIUM (prevents browser history API rate limiting on rapid input)
   - 5.5 [Use clearOnDefault for Clean URLs](references/perf-clear-on-default.md) — MEDIUM (reduces URL length by 20-50% for default values)
   - 5.6 [Use createSerializer for Link URLs](references/perf-serialize-utility.md) — MEDIUM (enables SSR-compatible URL generation without hooks)
6. [History & Navigation](references/_sections.md#6-history-&-navigation) — **MEDIUM**
   - 6.1 [Choose the Right history Mode (push vs replace)](references/history-push-navigation.md) — MEDIUM (back button behaves as users expect for navigation vs ephemeral state)
   - 6.2 [Control Scroll Behavior on URL Changes](references/history-scroll-behavior.md) — MEDIUM (prevents jarring scroll jumps on state changes)
7. [Debugging & Testing](references/_sections.md#7-debugging-&-testing) — **LOW-MEDIUM**
   - 7.1 [Enable Debug Logging for Troubleshooting](references/debug-enable-logging.md) — LOW-MEDIUM (surfaces the exact parse/serialize/URL-write step instead of guessing from silent state)
   - 7.2 [Test Components with URL State](references/debug-testing.md) — LOW-MEDIUM (enables reliable CI/CD testing of nuqs components)
8. [Advanced Patterns](references/_sections.md#8-advanced-patterns) — **LOW**
   - 8.1 [Create Custom Parsers for Complex Types](references/advanced-custom-parsers.md) — LOW (prevents runtime errors from string coercion)
   - 8.2 [Implement eq Function for Object Parsers](references/advanced-eq-function.md) — LOW (prevents unnecessary URL updates for equivalent objects)
   - 8.3 [Use Framework-Specific Adapters](references/advanced-framework-adapters.md) — LOW (prevents URL sync failures in non-Next.js apps)
   - 8.4 [Use processUrlSearchParams for Canonical URL Shape](references/advanced-process-url-search-params.md) — LOW-MEDIUM (enables stable URL ordering for SEO and cache hit-rate)
   - 8.5 [Use urlKeys for Shorter URLs](references/advanced-url-keys.md) — LOW (keeps shareable links compact by shortening verbose URL keys)

---

## References

1. [https://nuqs.dev](https://nuqs.dev)
2. [https://nuqs.dev/blog/nuqs-2.5](https://nuqs.dev/blog/nuqs-2.5)
3. [https://github.com/47ng/nuqs/releases/tag/v2.9.0](https://github.com/47ng/nuqs/releases/tag/v2.9.0)
4. [https://github.com/47ng/nuqs](https://github.com/47ng/nuqs)
5. [https://nextjs.org/docs](https://nextjs.org/docs)
6. [https://react.dev](https://react.dev)
7. [https://standardschema.dev](https://standardschema.dev)

---

## Source Files

This document was compiled from individual reference files. For detailed editing or extension:

| File | Description |
|------|-------------|
| [references/_sections.md](references/_sections.md) | Category definitions and ordering |
| [assets/templates/_template.md](assets/templates/_template.md) | Template for creating new rules |
| [SKILL.md](SKILL.md) | Quick reference entry point |
| [metadata.json](metadata.json) | Version and reference URLs |