# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Parser Configuration (parser)

**Impact:** CRITICAL
**Description:** Incorrect parsers cause type mismatches, runtime errors, and hydration failures. Parser selection cascades through the entire state lifecycle.

## 2. Adapter & Setup (setup)

**Impact:** CRITICAL
**Description:** Missing NuqsAdapter or incorrect setup causes hooks to fail silently or throw. Foundation for all nuqs functionality.

## 3. State Management (state)

**Impact:** HIGH
**Description:** Proper use of useQueryState vs useQueryStates, default values, and null handling prevents unnecessary complexity and bugs.

## 4. Server Integration (server)

**Impact:** HIGH
**Description:** Server cache and shallow routing configuration determines whether state changes trigger expensive server re-renders.

## 5. Performance Optimization (perf)

**Impact:** MEDIUM
**Description:** Throttling, batching, and update coalescing prevent browser rate-limiting and reduce unnecessary URL updates.

## 6. History & Navigation (history)

**Impact:** MEDIUM
**Description:** History mode selection affects UX - push vs replace impacts back button behavior and navigation experience.

## 7. Debugging & Testing (debug)

**Impact:** LOW-MEDIUM
**Description:** Debug logging, testing strategies, and common error diagnosis enable faster development cycles.

## 8. Advanced Patterns (advanced)

**Impact:** LOW
**Description:** Custom parsers, serializers, URL key mapping for complex use cases requiring careful implementation.
