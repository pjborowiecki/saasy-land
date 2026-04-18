---
name: dotenvx
description: Use dotenvx to run commands with environment variables, manage multiple .env files, expand variables, and encrypt env files for safe commits and CI/CD.
---

# dotenvx

`dotenvx` is a secure dotenv workflow for any language.

Use this skill when you need to:
- run commands with env vars from `.env` files
- load multiple environment files (`.env`, `.env.production`, etc.)
- encrypt `.env` files and keep keys out of git
- use env files safely in CI/CD

## Quickstart

Install:

```sh
npm install @dotenvx/dotenvx --save
# or globally:
# curl -sfS https://dotenvx.sh | sh
# brew install dotenvx/brew/dotenvx
```

Node usage:

```js
require('@dotenvx/dotenvx').config()
// or: import '@dotenvx/dotenvx/config'
```

CLI usage (any language):

```sh
dotenvx run -- node index.js
```

## Core Commands

Run with default `.env`:

```sh
dotenvx run -- <command>
```

Load a specific file:

```sh
dotenvx run -f .env.production -- <command>
```

Load multiple files (first wins):

```sh
dotenvx run -f .env.local -f .env -- <command>
```

Make later files win:

```sh
dotenvx run -f .env.local -f .env --overload -- <command>
```

## Encryption Workflow

Encrypt:

```sh
dotenvx encrypt
# or
dotenvx encrypt -f .env.production
```

Run encrypted envs by supplying private key(s):

```sh
DOTENV_PRIVATE_KEY_PRODUCTION="<key>" dotenvx run -f .env.production -- <command>
```

Git rule:

```gitignore
.env.keys
```

Commit encrypted `.env*` files if needed, but never commit `.env.keys`.

## Variable Expansion

Example:

```ini
USERNAME="alice"
DATABASE_URL="postgres://${USERNAME}@localhost/mydb"
```

`dotenvx run` resolves `${...}` expressions at runtime.

## CI/CD Pattern

Set private keys as CI secrets, then run through `dotenvx`:

```yaml
env:
  DOTENV_PRIVATE_KEY_PRODUCTION: ${{ secrets.DOTENV_PRIVATE_KEY_PRODUCTION }}
run: dotenvx run -f .env.production -- node index.js
```

## Agent Usage

Install this repo as an agent skill package:

```sh
npx skills add motdotla/dotenv
```

Typical requests:
- "set up dotenvx for production"
- "encrypt my .env.production and wire CI"
- "load .env.local and .env safely"

## References

- https://dotenvx.com/docs/quickstart
- https://github.com/dotenvx/dotenvx
