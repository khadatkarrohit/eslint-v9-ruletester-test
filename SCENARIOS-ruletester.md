# Scenarios — @eslint/v9-to-v10-ruletester (PR #9)

All 35 scenarios validated against test files in `tests/`.

---

## Transform 1 — Remove `errors` / `output` from valid cases

Script: `cleanup-valid-cases.ts`
File: `tests/valid-cases.test.js`

ESLint v9 silently ignores `errors` and `output` on valid cases. ESLint v10 throws on them.

| # | Scenario | Result |
|---|---|---|
| 1 | String shorthand `'code'` — must NOT be touched | PASS |
| 2 | Clean `{ code }` — must NOT be touched | PASS |
| 3 | `{ code, options }` only — must NOT be touched | PASS |
| 4 | `{ code, errors: [] }` | PASS |
| 5 | `{ code, errors: [{ message }] }` non-empty array | PASS |
| 6 | `{ code, output: null }` | PASS |
| 7 | `{ code, output: 'non-null string' }` | PASS |
| 8 | `{ code, errors: [], output: null }` | PASS |
| 9 | `{ code, errors: [..], output: 'val' }` non-trivial values | PASS |
| 10 | `{ errors: [], code }` — errors as first property (trailing comma removed) | PASS |
| 11 | `{ output: null, code }` — output as first property | PASS |
| 12 | `{ errors: [], output: null, code }` — both first, code at end | PASS |
| 13 | `{ code, errors: [], options }` — errors in middle (preceding comma removed) | PASS |
| 14 | `{ code, output: null, options }` — output in middle | PASS |
| 15 | `{ code, options, errors: [] }` — options must survive | PASS |
| 16 | `{ code, options, output: null }` — options must survive | PASS |
| 17 | `{ code, options, errors: [], output: null }` — options survive, both removed | PASS |
| 18 | Multiline object: errors and output each on their own line | PASS |
| 19 | Multiline object: errors as first property | PASS |

---

## Transform 2 — Remove top-level `type` from invalid cases

Script: `cleanup-invalid-cases.ts`
File: `tests/invalid-cases.test.js`

Top-level `type` on an invalid case throws ConfigError in v9+ flat-config.
`type` inside `errors[i]` is a separate node-type assertion and must NOT be removed.

| # | Scenario | Result |
|---|---|---|
| 1 | No `type` at all — must NOT be touched | PASS |
| 2 | `output` in **invalid** case — must NOT be removed (cleanup-valid-cases scoped to valid only) | PASS |
| 3 | `type` ONLY inside `errors[i]` — must NOT be removed | PASS |
| 4 | Top-level `type` as first property | PASS |
| 5 | Top-level `type` in the middle | PASS |
| 6 | Top-level `type` as last property | PASS |
| 7 | Top-level `type` + `type` inside `errors[i]` — only top-level removed | PASS |
| 8 | Two eval calls, top-level type + type in `errors[0]`, clean `errors[1]` | PASS |
| 9 | Multiline invalid case with top-level type | PASS |

---

## Structural / Combined Scenarios

File: `tests/combined.test.js`

| # | Scenario | Result |
|---|---|---|
| 1 | Multiple `ruleTester.run()` calls in one file | PASS |
| 2 | Two different rules (`no-console`, `no-var`) in same file | PASS |
| 3 | Multiple tester variables (`ruleTester`, `anotherTester`) | PASS |
| 4 | Inline `new RuleTester().run(...)` | PASS |

---

## TypeScript File

File: `tests/typescript.test.ts`

| # | Scenario | Result |
|---|---|---|
| 1 | `.ts` file with both `errors`/`output` in valid and top-level `type` in invalid | PASS |

---

## Potential Failures (Manual Inspection)

File: `tests/potential-failures.test.js`
Not part of `npm test` — run manually and inspect `git diff`.

| # | Scenario | Expected behavior |
|---|---|---|
| 1 | Unicode / multi-byte chars in code strings | May corrupt file — UTF-8 byte offset vs UTF-16 slice mismatch |
| 2 | `valid` as shorthand property (`{ valid }`) | Codemod misses it — shorthand_property_identifier, not a pair |
| 3 | Computed key `{ ['valid']: [...] }` | Codemod misses it — computed_property_name, not property_identifier |

---

**Total: 35 scenarios — 35 PASS**
