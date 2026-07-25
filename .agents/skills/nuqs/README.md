# nuqs Best Practices for Next.js

A comprehensive best practices skill for using [nuqs](https://nuqs.dev) - type-safe URL query state management - in Next.js applications.

## Overview

This skill provides 42 rules across 8 categories to help AI agents and developers write correct, performant, and maintainable code when using nuqs for URL state management.

## Getting Started

```bash
# Install dependencies (if any)
pnpm install

# Build AGENTS.md from references
pnpm build

# Validate the skill
pnpm validate
```

## Categories

| Priority | Category | Impact | Rules |
|----------|----------|--------|-------|
| 1 | Parser Configuration | CRITICAL | 8 |
| 2 | Adapter & Setup | CRITICAL | 5 |
| 3 | State Management | HIGH | 7 |
| 4 | Server Integration | HIGH | 6 |
| 5 | Performance Optimization | MEDIUM | 5 |
| 6 | History & Navigation | MEDIUM | 4 |
| 7 | Debugging & Testing | LOW-MEDIUM | 3 |
| 8 | Advanced Patterns | LOW | 4 |

## Creating a New Rule

1. Create a new file in `references/` with the pattern `{prefix}-{slug}.md`
2. Use the template from `assets/templates/_template.md`
3. Include YAML frontmatter with `title`, `impact`, `impactDescription`, `tags`
4. Add **Incorrect** and **Correct** code examples
5. Run `pnpm build` to regenerate AGENTS.md
6. Run `pnpm validate` to check for errors

## Rule File Structure

```markdown
---
title: Rule Title
impact: CRITICAL|HIGH|MEDIUM|LOW
impactDescription: Quantified impact (e.g., "2-10× improvement")
tags: prefix, keyword1, keyword2
---

## Rule Title

Explanation of WHY this matters.

**Incorrect (annotation):**
\`\`\`tsx
// Bad code example
\`\`\`

**Correct (annotation):**
\`\`\`tsx
// Good code example
\`\`\`

Reference: [Link](url)
```

## File Naming Convention

- Rule files: `{prefix}-{descriptive-slug}.md` (e.g., `parser-use-typed-parsers.md`)
- Prefix must match a section defined in `references/_sections.md`
- Use lowercase with hyphens

## Impact Levels

| Level | Description |
|-------|-------------|
| CRITICAL | Causes build failures, runtime errors, or major performance issues |
| HIGH | Significant bugs, performance degradation, or maintenance problems |
| MEDIUM | Noticeable issues or suboptimal patterns |
| LOW-MEDIUM | Minor improvements or edge case handling |
| LOW | Nice-to-have optimizations or advanced patterns |

## Scripts

- `pnpm build` - Regenerate AGENTS.md from references
- `pnpm validate` - Check skill against quality guidelines

## Contributing

1. Check existing rules to avoid duplication
2. Follow the rule template structure
3. Include production-realistic code examples
4. Quantify impact where possible
5. Run validation before submitting

## References

- [nuqs Documentation](https://nuqs.dev)
- [nuqs GitHub](https://github.com/47ng/nuqs)
- [Next.js Documentation](https://nextjs.org/docs)
