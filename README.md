# eslint-codemod-test-fixtures

Test-target repo for two ESLint v9-to-v10 codemods.

- **PR#9** `@eslint/v9-to-v10-ruletester` → see [SCENARIOS-ruletester.md](./SCENARIOS-ruletester.md)
- **PR#8** `@eslint/v9-to-v10-custom-rules` → see [SCENARIOS-custom-rules.md](./SCENARIOS-custom-rules.md)

---

## Get started

```bash
git clone https://github.com/khadatkarrohit/eslint-v9-ruletester-test.git
cd eslint-v9-ruletester-test
npm install
```

---

## Test PR#9 — RuleTester migration

```bash
# 1. Run ALL scenarios before codemod — will FAIL (expected)
npm test

# 2. Run codemod from source (inside the codemods repo)
npx codemod jssg run --language javascript --allow-dirty \
  --target /path/to/eslint-v9-ruletester-test \
  ./codemods/v10/ruletester/scripts/cleanup-valid-cases.ts

npx codemod jssg run --language javascript --allow-dirty \
  --target /path/to/eslint-v9-ruletester-test \
  ./codemods/v10/ruletester/scripts/cleanup-invalid-cases.ts

# 3. Run ALL scenarios after codemod — all should pass
npm test
npm run test:ts
```

`npm test` covers **all 32 scenarios** across 3 files at once:

| Command | File | Scenarios covered |
|---|---|---|
| `node tests/valid-cases.test.js` | `tests/valid-cases.test.js` | 19 — errors/output removal |
| `node tests/invalid-cases.test.js` | `tests/invalid-cases.test.js` | 8 — type removal |
| `node tests/combined.test.js` | `tests/combined.test.js` | 4 structural + both transforms |
| `npm run test:ts` | `tests/typescript.test.ts` | 1 TypeScript file |

To run a **specific scenario file** individually:

```bash
node tests/valid-cases.test.js
node tests/invalid-cases.test.js
node tests/combined.test.js
```

### Reset and retest PR#9

After the codemod runs it modifies the `tests/` files. To restore them to the original pre-codemod state and retest from scratch:

```bash
# Reset ALL test files
git checkout tests/

# Reset a specific scenario file only
git checkout tests/valid-cases.test.js
git checkout tests/invalid-cases.test.js
git checkout tests/combined.test.js
git checkout tests/typescript.test.ts
git checkout tests/potential-failures.test.js
```

Then repeat from Step 1.

---

## Test PR#8 — Custom rules migration

```bash
# 1. Run codemod from source (inside the codemods repo)
npx codemod jssg run --language javascript --allow-dirty \
  --target /path/to/eslint-v9-ruletester-test \
  ./codemods/v10/custom-rules/scripts/replace-context-methods.ts

npx codemod jssg run --language javascript --allow-dirty \
  --target /path/to/eslint-v9-ruletester-test \
  ./codemods/v10/custom-rules/scripts/replace-sourcecode-methods.ts

# 2. Inspect ALL transformed files at once
git diff custom-rules/

# 3. Check TODO comments that need manual action
grep -rn "TODO" custom-rules/
```

The codemod runs against **all 6 files** and covers **all 20 scenarios** in one pass.
To inspect or test a **specific scenario file** individually:

```bash
# Inspect one file's diff
git diff custom-rules/context-methods.js
git diff custom-rules/context-fallback.js
git diff custom-rules/context-no-replacement.js
git diff custom-rules/sourcecode-basic.js
git diff custom-rules/sourcecode-skip-arg.js
git diff custom-rules/sourcecode-chained.js
```

| File | Script | Scenarios |
|---|---|---|
| `context-methods.js` | `replace-context-methods.ts` | 1–6 — context method → property |
| `context-fallback.js` | `replace-context-methods.ts` | 7–10 — nullish fallback cleanup |
| `context-no-replacement.js` | `replace-context-methods.ts` | 11–12 — parserPath TODO |
| `sourcecode-basic.js` | `replace-sourcecode-methods.ts` | 13–16 — basic SourceCode methods |
| `sourcecode-skip-arg.js` | `replace-sourcecode-methods.ts` | 17–18 — skip argument |
| `sourcecode-chained.js` | `replace-sourcecode-methods.ts` | 19–20 — chained access |

### Reset and retest PR#8

After the codemod runs it modifies the `custom-rules/` files. To restore them to the original pre-codemod state and retest from scratch:

```bash
# Reset ALL custom-rules files
git checkout custom-rules/

# Reset a specific scenario file only
git checkout custom-rules/context-methods.js
git checkout custom-rules/context-fallback.js
git checkout custom-rules/context-no-replacement.js
git checkout custom-rules/sourcecode-basic.js
git checkout custom-rules/sourcecode-skip-arg.js
git checkout custom-rules/sourcecode-chained.js
```

Then repeat from Step 1.
