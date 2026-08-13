/**
 * The feature bundle, in its own module so it can be code-split.
 *
 * `domMax` rather than `domAnimation` because the run panel in the CLI section reflows a grid
 * when a capability is switched off, and only the layout features can make the remaining rows
 * travel to their new positions instead of jumping. That is 25kb against 15kb, and it is the
 * whole reason this file is dynamically imported rather than bundled: nothing above the fold
 * animates, so the cost lands after first paint or never.
 */
export { domMax as default } from "motion/react"
