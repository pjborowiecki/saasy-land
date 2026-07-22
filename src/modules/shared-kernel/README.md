# Shared kernel

Small cross-context domain building blocks. Not a dump of app settings.

## Where to look

| Looking for                                                                                        | Put / find it here                               |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Valid **codes & types** (currency, timezone, country, locale, email, ids, `Result`, domain errors) | `shared-kernel/domain/`                          |
| Enabled UI locales & locale cookie                                                                 | `src/integrations/next-intl/i18n.config.ts`      |
| Role codes (`RoleCode` / `Role` VO)                                                                | `identity-access/domain/value-objects/role.ts`   |
| Permission actions / resources                                                                     | `identity-access/domain/permissions.ts`          |
| Route paths                                                                                        | `src/routes.ts`                                  |
| Post-auth intent → path                                                                            | `src/post-auth.ts` (intent from `auth.access`)   |
| Theme defaults                                                                                     | `src/presentation/theme/`                        |
| Branding (name, GitHub, contact)                                                                   | `src/presentation/branding/`                     |
| Shared `cn()`                                                                                      | `src/presentation/utils/`                        |
| Admin sidebar nav                                                                                  | `src/app/[locale]/(admin)/admin/_lib/sidebar.ts` |
| Context-specific rules (product status, role behavior)                                             | that module’s own `domain/`                      |

**Rule:** if it’s “is this value _valid_ in the domain?”, it belongs in the kernel (or a single context). If it’s “what does _this app_ enable in the UI/deploy?”, colocate it with the owner (integration, module, presentation, or route `_lib`).

Examples:

- Catalog types + code lists: `LocaleCode` / `CurrencyCode` / `CountryCode` / `TimezoneCode` / `RoleCode`
- VOs: `Locale`, `Currency`, `Country`, `Timezone`, `Role`
- Display names → `messages/{locale}/locales.json` | `currencies.json` | `countries.json` | `timezones.json`
- Enabled UI locales (`I18N.LOCALES`) → next-intl config; route paths → `src/routes.ts`
