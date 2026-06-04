import { execSync, spawnSync } from 'node:child_process'

// ─── Real-world patterns found in production repos ─────────────────────────

// 1. cross-env prefix (microsoft/pyright, strvcom/code-quality-tools)
execSync('cross-env eslint .')
execSync('cross-env eslint --fix .')

// 2. Makefile-style: export keyword on its own (strvcom/code-quality-tools)
execSync('make lint')

// 3. Partial variable name — must NOT be touched
const myVar = 'MY_ESLINT_USE_FLAT_CONFIG=true'
const disableVar = 'DISABLE_ESLINT_USE_FLAT_CONFIG=false'

// 4. JS object literal env block (projen, NX) — NOT handled by codemod (colon syntax)
const opts = {
  env: {
    ESLINT_USE_FLAT_CONFIG: 'false',
    PATH: process.env['PATH'],
  },
}

// 5. process.env assignments — NOT handled (JS-level, not shell-level)
process.env['ESLINT_USE_FLAT_CONFIG'] = 'true'
process.env.ESLINT_USE_FLAT_CONFIG = 'false'

// 6. .env file style — flat assignment inside template literal
const dotenvContent = `
NODE_ENV=production
`

// 7. Multiple (separate, not comma-separated)
execSync('eslint src/')

// 8. no value at end of command
execSync('eslint src/')

// 9. followed immediately by another flag
execSync('eslint --fix src/')

// 10. Removed env var inside a longer pipeline
execSync('eslint . | tee lint.log')

// 11. cross-env with --ext valid flag preserved
const winScript = 'cross-env eslint --ext .ts,.tsx src/'

// 12. ESLINT_FLAGS with mixed valid and removed values
const flags1 = 'ESLINT_FLAGS=some-valid-flag npx eslint .'
const flags2 = 'ESLINT_FLAGS=some-valid-flag npx eslint .'

// 13. YAML GitHub Actions env: block (colon syntax) — NOT handled (known limitation)
const githubActionsYaml = `
env:
  ESLINT_USE_FLAT_CONFIG: "true"
  NODE_ENV: production
`
