# eslint-v9-ruletester-test

A test-target repository for the [`@eslint/v9-to-v10-ruletester`](https://github.com/codemod-com/codemod/tree/main/codemods/v10/ruletester) codemod.

The test files contain real-world RuleTester patterns from ESLint v8/v9 codebases
that break in v9+ or v10. Running the codemod against this repo removes all those
patterns and makes the test suite green.

See [SCENARIOS.md](./SCENARIOS.md) for a full list of the 35 scenarios covered.

---

## What the codemod removes

| Pattern | Where | Breaks in |
|---|---|---|
| `errors` / `output` on a `valid` test case | `tests/valid-cases.test.js` | ESLint v10 |
| Top-level `type` on an `invalid` test case | `tests/invalid-cases.test.js`, `tests/combined.test.js`, `tests/typescript.test.ts` | ESLint v9+ (flat config) |

---

## Prerequisites

- Node.js 18+
- npm or npx available

---

## How to test the codemod step by step

### Step 1 — Clone and install

```bash
git clone https://github.com/rohitkhadatkar/eslint-v9-ruletester-test.git
cd eslint-v9-ruletester-test
npm install
```

### Step 2 — Run tests before the codemod (expected to fail)

```bash
npm test
```

Expected output:

```
valid-cases tests passed
ConfigError: ESLint configuration in rule-tester is invalid:
  Config (unnamed): Unexpected key "type" found.
```

`valid-cases.test.js` passes because ESLint v9 silently ignores `errors`/`output`
in valid cases. Everything after that fails because top-level `type` in invalid
cases throws a `ConfigError` in v9's flat-config RuleTester.

### Step 3 — Run the codemod

**Option A — Once the codemod is published to the registry:**

```bash
npx codemod @eslint/v9-to-v10-ruletester
```

**Option B — Run locally from the codemods source repo:**

```bash
# From the root of codemod-com/codemod repo
npx codemod jssg run --language javascript --allow-dirty \
  --target /path/to/eslint-v9-ruletester-test \
  ./codemods/v10/ruletester/scripts/cleanup-valid-cases.ts

npx codemod jssg run --language javascript --allow-dirty \
  --target /path/to/eslint-v9-ruletester-test \
  ./codemods/v10/ruletester/scripts/cleanup-invalid-cases.ts
```

### Step 4 — Inspect the diff

```bash
git diff
```

You should see:
- `errors: []` / `output: null` removed from all `valid` test case objects
- Top-level `type: '...'` removed from all `invalid` test case objects
- `type` inside `errors[i]` objects **untouched**

### Step 5 — Run tests after the codemod (all should pass)

```bash
npm test
```

Expected output:

```
valid-cases tests passed
invalid-cases tests passed
combined tests passed
```

### Step 6 — TypeScript file (optional)

```bash
npm run test:ts
```

Expected output:

```
typescript tests passed
```

### Step 7 — Inspect potential failure edge cases (optional)

These cases are NOT part of `npm test`. They document codemod limitations.

```bash
# First restore the original file, then run:
git checkout tests/potential-failures.test.js
node tests/potential-failures.test.js
git diff tests/potential-failures.test.js
```

See [SCENARIOS.md](./SCENARIOS.md) for what to expect.

---

## File structure

```
rules/
  no-console.js          Simple rule: disallows console.* calls
  no-eval.js             Simple rule: disallows eval() calls
  no-var.js              Simple rule: disallows var declarations
tests/
  valid-cases.test.js    19 scenarios for errors/output removal from valid cases
  invalid-cases.test.js  8 scenarios for top-level type removal from invalid cases
  combined.test.js       Structural: multiple runs, variables, inline tester, two rules
  typescript.test.ts     Same patterns in a .ts file
  potential-failures.test.js  Edge cases that expose codemod limitations (not in npm test)
SCENARIOS.md             Full scenario list with expected behavior
```
