/**
 * Printed only after `vp check` succeeds (the `check` script chains with `&&`), so every line
 * below reflects a verification that actually ran and passed in this invocation.
 */
process.stdout.write("✅ Formatting matches the vp formatter.\n")
process.stdout.write("✅ Lint passed (oxlint, type-aware rules).\n")
process.stdout.write("✅ Types check out (TypeScript, whole project).\n")
