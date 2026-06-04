import { execSync } from 'node:child_process'

// 1. Basic true/false removal
execSync('ESLINT_USE_FLAT_CONFIG=true eslint .')
execSync('ESLINT_USE_FLAT_CONFIG=false eslint .')

// 2. With export keyword
execSync('export ESLINT_USE_FLAT_CONFIG=true && eslint .')

// 3. With extra flags after
execSync('ESLINT_USE_FLAT_CONFIG=true eslint . --fix --max-warnings 0')

// 4. ESLINT_FLAGS with single removed value
execSync('ESLINT_FLAGS=v10_config_lookup_from_file npx eslint .')

// 5. ESLINT_FLAGS with earlier aliases (removed in v9.x)
execSync('ESLINT_FLAGS=unstable_config_lookup_from_file npx eslint .')
execSync('ESLINT_FLAGS=unstable_ts_config npx eslint .')

// 6. ESLINT_FLAGS with multiple values — some removed, some not
process.env.ESLINT_FLAGS = 'v10_config_lookup_from_file,some-other-flag'
process.env.ESLINT_FLAGS = 'some-other-flag,v10_config_lookup_from_file'
process.env.ESLINT_FLAGS = 'flag-a,v10_config_lookup_from_file,flag-b'

// 7. Unrelated env vars — must NOT be touched
process.env.NODE_ENV = 'production'
process.env.CI = 'true'
