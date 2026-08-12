/**
 * The questions the scaffold asks and the flags that answer them, in the order it asks them.
 *
 * Its own module, and not the configurator's, because both sides of the boundary read it: the
 * Server Component composes the rows from it with the labels translated, and the Client Component
 * assembles the command from it. A constant exported from a `"use client"` file reaches a Server
 * Component as a client reference rather than as its value, so this one cannot live there.
 *
 * The flags are deliberately not in the message catalogue. A translator turning `--no-billing`
 * into `--bez-platnosci` would hand a Polish visitor a command that fails, so the copy describing
 * an option is translated and the token invoking it is not.
 *
 * The syntax is the boring one on purpose: `--flag value` to choose between implementations,
 * `--no-flag` to leave a capability out. That is what Commander, yargs and clap parse without
 * configuration, it is what `create-next-app` and `create-t3-app` already taught people to expect,
 * and it means the string survives being pasted into a script rather than into a prompt.
 *
 * The first option of each is the default, in both senses: it is what the command starts as, and
 * it is the configuration the run beside it was rendered from.
 */
export const CLI_CHOICES = [
  {
    id: "framework",
    options: [
      { flag: "--framework next", id: "next" },
      { flag: "--framework tanstack", id: "tanstack" },
    ],
  },
  {
    id: "tenancy",
    options: [
      { flag: "--tenancy multi", id: "multi" },
      { flag: "--tenancy single", id: "single" },
    ],
  },
  {
    id: "billing",
    options: [
      { flag: "--billing stripe", id: "stripe" },
      { flag: "--no-billing", id: "none" },
    ],
  },
  {
    id: "content",
    options: [
      { flag: "--content mdx", id: "mdx" },
      { flag: "--no-content", id: "none" },
    ],
  },
  {
    id: "email",
    options: [
      { flag: "--email resend", id: "resend" },
      { flag: "--no-email", id: "none" },
    ],
  },
] as const

/** The option every question offers for leaving a capability out, and the one that writes nothing. */
export const NONE = "none"

/**
 * The ten modules the scaffold writes, in the order the manifest lists them, and the question each
 * one depends on.
 *
 * Same names and same count as "What is in the box", because a visitor who scrolls from here to
 * there must find the same ten things. Seven are unconditional; the three that carry a `choiceId`
 * are written only when that question was answered with something other than `none`, which is what
 * lets the run beside the matrix be the matrix's actual output rather than an illustration of it.
 *
 * Deliberately untranslated, for the same reason the flags are: these are directory names printed
 * by a program, and a localised `uwierzytelnianie` would be a directory nobody has.
 */
export const CLI_MODULES = [
  { id: "auth" },
  { id: "database" },
  { choiceId: "billing", id: "billing" },
  { choiceId: "email", id: "email" },
  { id: "admin" },
  { id: "ui" },
  { id: "i18n" },
  { choiceId: "content", id: "content" },
  { id: "tests" },
  { id: "tooling" },
] as const
