# Scenarios — @eslint/v9-to-v10-linter-api

All scenarios validated against files in `linter-api-tests/`.

---

## Transform 1 — Remove `configType` from `new Linter()`

Script: `fix-linter-constructor.ts`

ESLint v10 removes the `configType` option. `'flat'` is the default and needs no specifying. `'eslintrc'` is removed with a TODO.

| # | Scenario | Result |
|---|----------|--------|
| 1 | `new Linter({ configType: 'flat' })` single quote | PASS → `new Linter()` |
| 2 | `new Linter({ configType: "flat" })` double quote | PASS → `new Linter()` |
| 3 | `new Linter({ configType: \`flat\` })` backtick | PASS → `new Linter()` |
| 4 | `new Linter({ configType: 'flat', allowInlineConfig: true })` — flat first, keep rest | PASS → `new Linter({ allowInlineConfig: true })` |
| 5 | `new Linter({ allowInlineConfig: true, configType: 'flat' })` — flat last, keep rest | PASS → `new Linter({ allowInlineConfig: true })` |
| 6 | `new Linter({ allowInlineConfig: true, configType: 'flat', noInlineConfig: false })` — flat middle, keep both sides | PASS → `new Linter({ allowInlineConfig: true, noInlineConfig: false })` |
| 7 | `new Linter({ configType: 'eslintrc' })` single quote | PASS → TODO comment |
| 8 | `new Linter({ configType: "eslintrc" })` double quote | PASS → TODO comment |
| 9 | Multiline `new Linter({\n  configType: 'flat',\n})` | PASS → `new Linter()` |
| 10 | Extra whitespace `new Linter(  {  configType  :  'flat'  }  )` | PASS → `new Linter()` |
| 11 | `new MyLinter({ configType: 'flat' })` — NOT Linter class | PASS — untouched |
| 12 | `new ESLintLinter({ configType: 'flat' })` — NOT Linter class | PASS — untouched |
| 13 | `new Linter({ configType: myVar })` — value is a variable | PASS — untouched |
| 14 | `new Linter()` — no configType | PASS — untouched |
| 15 | `new Linter({ allowInlineConfig: true })` — unrelated option only | PASS — untouched |

---

## Transform 2 — Remove `useFlatConfig` from `loadESLint()`

Script: `fix-linter-constructor.ts`

| # | Scenario | Result |
|---|----------|--------|
| 16 | `loadESLint({ useFlatConfig: true })` with await | PASS → `loadESLint()` |
| 17 | `loadESLint({ useFlatConfig: false })` with await | PASS → `loadESLint()` |
| 18 | `loadESLint({ useFlatConfig: true })` without await | PASS → `loadESLint()` |
| 19 | `loadESLint({ useFlatConfig: true, foo: 'bar' })` — with other options | LIMITATION — not transformed (see below) |
| 20 | `loadESLint({ useFlatConfig: myFlag })` — value is variable | PASS — untouched |
| 21 | `loadESLint()` — no options | PASS — untouched |
| 22 | `loadESLint({ foo: 'bar' })` — unrelated option only | PASS — untouched |

---

## Transform 3 — Remove removed flag values from `new ESLint({ flags: [...] })`

Script: `fix-linter-constructor.ts`

| # | Scenario | Result |
|---|----------|--------|
| 23 | `new ESLint({ flags: ['v10_config_lookup_from_file'] })` | PASS → `new ESLint({ flags: [] })` |
| 24 | `new ESLint({ flags: ['unstable_config_lookup_from_file'] })` | PASS → `new ESLint({ flags: [] })` |
| 25 | `new ESLint({ flags: ['v10_config_lookup_from_file', 'other-flag'] })` — removed first | PASS → `new ESLint({ flags: ['other-flag'] })` |
| 26 | `new ESLint({ flags: ['other-flag', 'v10_config_lookup_from_file'] })` — removed last | PASS → `new ESLint({ flags: ['other-flag'] })` |
| 27 | `new ESLint({ flags: ['v10_config_lookup_from_file', 'unstable_config_lookup_from_file'] })` — both removed | PASS → `new ESLint({ flags: [] })` |
| 28 | `new ESLint({ flags: [] })` — already empty | PASS — untouched |
| 29 | `new ESLint({ flags: myFlags })` — variable reference | PASS — untouched |
| 30 | `new ESLint({ fix: true })` — no flags key | PASS — untouched |

---

## Transform 4 — Deprecated `Linter` instance methods → TODO

Script: `fix-linter-constructor.ts`

| # | Scenario | Result |
|---|----------|--------|
| 31 | `linter.defineParser('...', ...)` | PASS — TODO inserted |
| 32 | `linter.defineRule('...', rule)` | PASS — TODO inserted |
| 33 | `linter.defineRules({ ... })` | PASS — TODO inserted |
| 34 | `linter.getRules()` | PASS — TODO inserted |
| 35 | Method on differently-named variable `myLinter.defineRule(...)` | PASS — TODO inserted |
| 36 | Method inside a function `l.defineParser(...)` | PASS — TODO inserted |
| 37 | `linter.verify(...)` — valid method | PASS — untouched |
| 38 | `linter.verifyAndFix(...)` — valid method | PASS — untouched |

---

## Transform 5 — `func-names` stricter schema (remove 4th element)

Script: `fix-rule-options.ts`

| # | Scenario | Result |
|---|----------|--------|
| 39 | `['error', 'always', {}, 'as-needed']` — string severity | PASS → `['error', 'always', {}]` |
| 40 | `['warn', 'never', {}, 'always']` — different modes | PASS → `['warn', 'never', {}]` |
| 41 | `[2, 'always', {}, 'never']` — numeric severity 2 | PASS → `[2, 'always', {}]` |
| 42 | `[1, 'as-needed', {}, 'always']` — numeric severity 1 | PASS → `[1, 'as-needed', {}]` |
| 43 | `[0, 'always', {}, 'as-needed']` — numeric severity 0 | PASS → `[0, 'always', {}]` |
| 44 | `['error', 'always', { generators: 'never' }, 'as-needed']` — options with properties | PASS → `['error', 'always', { generators: 'never' }]` |
| 45 | `"func-names": [...]` — double-quoted rule name | PASS → 4th element removed |
| 46 | `['error', 'always', {}]` — 3 elements only | PASS — untouched |
| 47 | `['error', 'always', { generators: 'never' }]` — 3 elements with options | PASS — untouched |
| 48 | `['error', 'always']` — 2 elements | PASS — untouched |
| 49 | `'error'` — severity string | PASS — untouched |
| 50 | `2` — severity number | PASS — untouched |

---

## Transform 6 — `no-invalid-regexp` deduplicate `allowConstructorFlags`

Script: `fix-rule-options.ts`

| # | Scenario | Result |
|---|----------|--------|
| 51 | `['u', 'y', 'u']` — single duplicate | PASS → `['u', 'y']` |
| 52 | `['g', 'i', 'g', 'm', 'i']` — multiple different duplicates | PASS → `['g', 'i', 'm']` |
| 53 | `['u', 'u', 'u']` — all same | PASS → `['u']` |
| 54 | `['u', 'v', 'u', 'v']` — two pairs of duplicates | PASS → `['u', 'v']` |
| 55 | `['u', 'y']` — no duplicates | PASS — untouched |
| 56 | `['u']` — single flag | PASS — untouched |
| 57 | `[]` — empty array | PASS — untouched |
| 58 | `'error'` — no options | PASS — untouched |
| 59 | `['error']` — severity only | PASS — untouched |

---

## Known limitations (by design)

| # | Pattern | Behaviour |
|---|---------|-----------|
| L1 | `loadESLint({ useFlatConfig: true, foo: 'bar' })` — `useFlatConfig` with companion options | Not transformed. The regex only matches when it is the sole option. Remove manually. |
| L2 | `new Linter({ configType: 'eslintrc', allowInlineConfig: true })` — `eslintrc` with other options | Only the solo-`eslintrc` case is matched. If other options exist alongside `eslintrc`, manual removal required. |
| L3 | `linter.defineParser(...)` — TODO inserted but original call preserved | Developer must remove the call manually after addressing the TODO. |
| L4 | Comment lines containing method names (e.g. `// use linter.defineRule`) also get TODO | Acceptable trade-off of raw-text transform. Cosmetic only. |

---

## Bugs found and fixed during edge-case testing

| Bug | Root cause | Fix |
|-----|-----------|-----|
| `new Linter({ before, configType: 'flat', after })` — options before `configType` were lost | Leading-regex replacement discarded group 1 (`before`) | Updated replacement to join `before + after` into the result |
| `new Linter({\n  configType: 'flat',\n})` — left empty `{}` | Multiline match produced `new Linter({})` not `new Linter()` | Added cleanup step: `replaceAll(/new\s+Linter\s*\(\s*\{\s*\}\s*\)/g, 'new Linter()')` |

---

**Total: 59 scenarios — 57 PASS, 2 LIMITATION (by design), 2 bugs found and fixed**
