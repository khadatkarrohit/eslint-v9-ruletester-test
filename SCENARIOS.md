# Test Scenarios

All scenarios tested against the `@eslint/v9-to-v10-ruletester` codemod.

---

## Transform 1 — Remove `errors` / `output` from valid cases

File: `tests/valid-cases.test.js`

ESLint v9 silently ignores `errors` and `output` properties on valid test cases.
ESLint v10 throws on them. The codemod removes them.

| # | Scenario | Property removed |
|---|---|---|
| 1 | String shorthand `'code'` — no transform | none |
| 2 | Clean object `{ code }` — no transform | none |
| 3 | Object with `options` only — no transform | none |
| 4 | `errors: []` (empty array) | `errors` |
| 5 | `errors: [{ message }]` (non-empty — still forbidden in valid) | `errors` |
| 6 | `output: null` | `output` |
| 7 | `output: 'non-null string'` | `output` |
| 8 | Both `errors: []` and `output: null` | `errors`, `output` |
| 9 | Both with non-trivial values | `errors`, `output` |
| 10 | `errors` as **first** property (trailing comma removed) | `errors` |
| 11 | `output` as **first** property (trailing comma removed) | `output` |
| 12 | Both as first properties, `code` at end | `errors`, `output` |
| 13 | `errors` in the **middle** between `code` and `options` (preceding comma removed) | `errors` |
| 14 | `output` in the **middle** between `code` and `options` | `output` |
| 15 | `options` + `errors` — `options` must survive | `errors` |
| 16 | `options` + `output` — `options` must survive | `output` |
| 17 | `options` + both — `options` must survive | `errors`, `output` |
| 18 | Multiline object: `errors` and `output` each on their own line | `errors`, `output` |
| 19 | Multiline object: `errors` as **first** property | `errors` |

---

## Transform 2 — Remove top-level `type` from invalid cases

File: `tests/invalid-cases.test.js`

In ESLint v8, a top-level `type` property on an invalid test case asserted the
node type of the reported violation. In v9+ flat-config, this property conflicts
with config schema validation and throws a `ConfigError`.

> Note: `type` **inside** `errors[i]` objects is a different feature — it asserts
> the reported node type per error and must NOT be removed by this codemod.

| # | Scenario | Top-level `type` removed | `errors[i].type` removed |
|---|---|---|---|
| 1 | No `type` at all — no transform | N/A | N/A |
| 2 | `type` **only inside** `errors[i]` — no transform | no | no |
| 3 | Top-level `type` as **first** property | yes | N/A |
| 4 | Top-level `type` in the **middle** | yes | N/A |
| 5 | Top-level `type` as **last** property | yes | N/A |
| 6 | Top-level `type` + `type` inside `errors[i]` — only top-level removed | yes | no |
| 7 | Two `eval()` calls → 2 errors; `type` in top-level and in `errors[0]` | yes | no |
| 8 | Multiline invalid case with top-level `type` | yes | N/A |

---

## Structural / combined scenarios

File: `tests/combined.test.js`

| # | Scenario | What is verified |
|---|---|---|
| 1 | Multiple `ruleTester.run()` calls in one file | Both valid and invalid transforms fire on every run call |
| 2 | Two different rules (`no-console`, `no-var`) in same file | Transforms are rule-agnostic; they fire on any `valid`/`invalid` key |
| 3 | Multiple tester variables (`ruleTester`, `anotherTester`) | Transforms are not tied to a specific variable name |
| 4 | Inline tester `new RuleTester().run(...)` | Transforms work on chained calls, not just variable-based testers |

---

## TypeScript file scenario

File: `tests/typescript.test.ts`

| # | Scenario |
|---|---|
| 1 | `.ts` file containing both `errors`/`output` in valid and top-level `type` in invalid |

The codemod `workflow.yaml` includes `**/*.ts` in its file glob, so TypeScript
test files are transformed the same way as JavaScript files.

---

## Potential failure / edge cases

File: `tests/potential-failures.test.js`

These are NOT part of `npm test`. Run manually after the codemod and inspect
the git diff to observe codemod behavior.

| # | Scenario | Expected codemod behavior |
|---|---|---|
| 1 | Unicode characters (emoji, accented chars) in code strings | File likely **corrupted** — codemod uses UTF-8 byte offsets; JS `slice()` uses UTF-16 code units. Any multi-byte character before a removed property shifts the range and corrupts adjacent content. |
| 2 | `valid` as a **shorthand property** (`const valid = [...]; { valid }`) | Codemod **misses** it — the selector matches `pair` nodes with a `property_identifier` key. Shorthand syntax creates a `shorthand_property_identifier` node, not a `pair`. |
| 3 | `valid` / `invalid` as **computed property keys** (`{ ['valid']: [...] }`) | Codemod **misses** it — computed keys are `computed_property_name` nodes, not `property_identifier` nodes. |
