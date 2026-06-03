# Scenarios — @eslint/v9-to-v10-custom-rules (PR #8)

All 30 scenarios validated against files in `custom-rules/`.
Verify by running the codemod and inspecting `git diff custom-rules/`.

---

## Transform 1 — Deprecated context methods → property access

Script: `replace-context-methods.ts`
File: `custom-rules/context-methods.js`

| # | Before | After | Result |
|---|---|---|---|
| 1 | `context.getFilename()` | `context.filename` | PASS |
| 2 | `context.getPhysicalFilename()` | `context.physicalFilename` | PASS |
| 3 | `context.getCwd()` | `context.cwd` | PASS |
| 4 | `context.getSourceCode()` | `context.sourceCode` | PASS |
| 5 | `context.parserOptions` | `context.languageOptions.parserOptions` | PASS |
| 6 | `context.languageOptions.parserOptions` already migrated | Unchanged — not double-wrapped | PASS |

---

## Transform 2 — v8→v9 nullish-coalescing fallback cleanup

Script: `replace-context-methods.ts`
File: `custom-rules/context-fallback.js`

| # | Before | After | Result |
|---|---|---|---|
| 7 | `context.filename ?? context.getFilename()` | `context.filename` | PASS |
| 8 | `context.physicalFilename ?? context.getPhysicalFilename()` | `context.physicalFilename` | PASS |
| 9 | `context.cwd ?? context.getCwd()` | `context.cwd` | PASS |
| 10 | `context.sourceCode ?? context.getSourceCode()` | `context.sourceCode` | PASS |

---

## Transform 3 — Removed properties with no direct replacement

Script: `replace-context-methods.ts`
File: `custom-rules/context-no-replacement.js`

| # | Before | After | Result |
|---|---|---|---|
| 11 | `context.parserPath` (variable assignment) | `context.parserPath /* TODO: removed, no replacement */` | PASS |
| 12 | `context.parserPath` in an `if` condition | `context.parserPath /* TODO: removed, no replacement */` | PASS |

---

## Transform 4 — Deprecated SourceCode methods (basic)

Script: `replace-sourcecode-methods.ts`
File: `custom-rules/sourcecode-basic.js`

| # | Before | After | Result |
|---|---|---|---|
| 13 | `sourceCode.getTokenOrCommentBefore(node)` | `sourceCode.getTokenBefore(node, { includeComments: true })` | PASS |
| 14 | `sourceCode.getTokenOrCommentAfter(node)` | `sourceCode.getTokenAfter(node, { includeComments: true })` | PASS |
| 15 | `sourceCode.isSpaceBetweenTokens(a, b)` | `sourceCode.isSpaceBetween(a, b)` | PASS |
| 16 | `sourceCode.getJSDocComment(node)` | `(null /* TODO: removed, no replacement */)` | PASS |

---

## Transform 5 — SourceCode methods with skip argument

Script: `replace-sourcecode-methods.ts`
File: `custom-rules/sourcecode-skip-arg.js`

| # | Before | After | Result |
|---|---|---|---|
| 17 | `sourceCode.getTokenOrCommentBefore(node, 1)` | `sourceCode.getTokenBefore(node, { includeComments: true, skip: 1 })` | PASS |
| 18 | `sourceCode.getTokenOrCommentAfter(node, 2)` | `sourceCode.getTokenAfter(node, { includeComments: true, skip: 2 })` | PASS |

---

## Transform 6 — Chained property access after deprecated method

Script: `replace-sourcecode-methods.ts`
File: `custom-rules/sourcecode-chained.js`

| # | Before | After | Result |
|---|---|---|---|
| 19 | `sourceCode.getTokenOrCommentBefore(node).value` | `sourceCode.getTokenBefore(node, { includeComments: true }).value` | PASS |
| 20 | `sourceCode.getTokenOrCommentAfter(node).type` | `sourceCode.getTokenAfter(node, { includeComments: true }).type` | PASS |

---

## Transform 7 — Arrow function `create` form

Script: `replace-context-methods.ts`
File: `custom-rules/context-arrow-fn.js`

| # | Before | After | Result |
|---|---|---|---|
| 21 | `context.getFilename()` inside `create: (context) => {}` | `context.filename` | PASS |
| 22 | `context.getCwd()` inside arrow function | `context.cwd` | PASS |
| 23 | `context.parserOptions` inside arrow function | `context.languageOptions.parserOptions` | PASS |

---

## Transform 8 — Deprecated methods nested inside expressions

Script: `replace-context-methods.ts`
File: `custom-rules/context-nested.js`

| # | Before | After | Result |
|---|---|---|---|
| 24 | `context.report({ message: context.getFilename() })` | `context.report({ message: context.filename })` | PASS |
| 25 | `if (context.getCwd().startsWith('/home'))` | `if (context.cwd.startsWith('/home'))` | PASS |
| 26 | `context.getFilename().endsWith('.ts')` | `context.filename.endsWith('.ts')` | PASS |
| 27 | `context.getSourceCode().getText(node)` | `context.sourceCode.getText(node)` | PASS |

---

## Transform 9 — context.getSourceCode() chained with deprecated sourceCode methods

Scripts: `replace-context-methods.ts` then `replace-sourcecode-methods.ts`
File: `custom-rules/sourcecode-context-chained.js`

Both scripts must run sequentially. Step 1 transforms `getSourceCode()`, step 2 transforms the resulting deprecated sourceCode method call.

| # | Before (after Step 1 → after Step 2) | Final result | Result |
|---|---|---|---|
| 28 | `context.getSourceCode().getTokenOrCommentBefore(node)` → `ctx.sourceCode.getTokenOrCommentBefore(node)` → | `ctx.sourceCode.getTokenBefore(node, { includeComments: true })` | PASS |
| 29 | `context.getSourceCode().getTokenOrCommentAfter(node)` | `ctx.sourceCode.getTokenAfter(node, { includeComments: true })` | PASS |
| 30 | `context.getSourceCode().isSpaceBetweenTokens(x, y)` | `ctx.sourceCode.isSpaceBetween(x, y)` | PASS |

> **Fix note:** Step 2 was previously broken for this pattern. `find()` used DFS and returned
> the inner `ctx.sourceCode` member expression first, extracting `"sourceCode"` as the method
> name and skipping the transform. Fixed by replacing `find()` with `children()` to always
> get the direct callee and its direct property.

---

**Total: 30 scenarios — 30 PASS**
