# Design guidelines

The website, account area, admin console, and documentation share a visual system. Preserve their existing layouts and behavior when refactoring.

## Source files

- `src/presentation/styles/globals.css`: theme colors, typography, radii, and animation utilities.
- `src/presentation/styles/fonts.css`: local font faces.
- `src/presentation/styles/typeset.css`: prose and documentation styles.
- `src/presentation/components/custom/landing-page/constants/motion-tokens.ts`: shared Motion transitions.
- `src/presentation/components/custom/admin/constants/status-colors.ts`: console status styles.

Use these definitions directly. Keep token values in CSS instead of copying them into documentation or individual components.

## Color and typography

- Use semantic color tokens and their opacity modifiers. Primary actions are monochrome; accent color indicates focus, selection, or status.
- Reserve destructive styling for errors and destructive actions. Status must also be understandable through text or icons.
- Keep existing token names stable. Check both themes when changing a token value.
- In authored CSS, read raw theme tokens such as `--border`, not the `--color-border` aliases declared by Tailwind. Raw tokens follow the nearest theme scope.
- Use Geist for interface text and Geist Mono for code, measurements, and system output.
- Use the existing `text-*` typography roles. Keep custom font-size roles registered in `src/lib/cn.ts` so merging a text color does not remove the size.
- Use `tabular-nums` for figures that update or align in columns.

## Layout and controls

- Marketing and authentication pages use dark surfaces. Account, admin, and documentation pages follow the saved theme.
- Preserve the landing page frame, section dividers, responsive gutters, and navbar progress line.
- Use `ROUTES` for navigation. Preserve section IDs used by navigation or external links.
- The admin users layout offsets its parent's padding. Keep `src/routes/admin.tsx` and `src/routes/admin.users.tsx` aligned when changing either layout.
- Use the existing radius scale, borders, and surface colors. Avoid adding decorative shadows, gradients, or unrelated visual styles.
- Keep controls functional and keyboard accessible. Remove dead navigation instead of linking to pages that do not exist.
- Keep layout readable with longer translations, narrow viewports, and zoomed text.

## Motion and media

- Animation must communicate a transition, feedback, or state. Prefer the existing CSS utilities and Motion presets.
- Every animation needs a reduced-motion presentation with the same information and controls.
- Keep initial server-rendered content visible. Reveal animations may hide content only after determining that it is below the viewport.
- Keep the navbar's observer and scroll progress behavior intact during layout changes.
- Concept videos use posters, deferred loading, and viewport-based playback. Reduced motion keeps the poster visible.
- Video backgrounds must match their surrounding surface. Interactive previews must reflect the selected options.
- Keep media source paths, commands, and displayed facts consistent with the implementation. Regenerate affected files in `public/motion` when changing their Remotion source.

## Implementation

- Keep reusable styling and behavior near their feature. A separate component or hook should remove duplication or own meaningful behavior.
- Derive values from existing props, form state, mutation state, or route data before introducing another state variable.
- Use refs for actual DOM access or non-rendering state that needs to persist. Do not use them to bypass dependencies or coordinate requests that belong in route loaders or event handlers.
- Keep comments for constraints that are not apparent from the code. Avoid design essays, obsolete migration notes, and claims about unmeasured performance.
