import { execSync } from 'node:child_process'

// 1. --no-eslintrc alone
execSync('eslint --no-eslintrc src/')

// 2. --env with single value
execSync('eslint --env browser src/')

// 3. --env with comma-separated values
execSync('eslint --env browser,node src/')

// 4. --rulesdir with path
execSync('eslint --rulesdir ./custom-rules src/')

// 5. --ignore-path with file
execSync('eslint --ignore-path .gitignore src/')

// 6. --resolve-plugins-relative-to with path
execSync('eslint --resolve-plugins-relative-to . src/')

// 7. Multiple removed flags in one command
execSync('eslint --no-eslintrc --env browser --rulesdir ./rules src/')

// 8. Removed flags mixed with valid flags that must survive
execSync('eslint --no-eslintrc --fix --max-warnings 0 --env browser src/')

// 9. Template literal (multi-line script)
const cmd = `
  eslint \
    --no-eslintrc \
    --env browser \
    --fix \
    src/
`

// 10. Flag at very end of command (no trailing path)
execSync('eslint src/ --no-eslintrc')

// 11. Valid flags only — must NOT be touched
execSync('eslint --fix --max-warnings 0 src/')
