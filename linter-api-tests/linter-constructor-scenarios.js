import { Linter, ESLint, loadESLint } from 'eslint'

// ── 1. new Linter() — only option ───────────────────
const linter1 = new Linter()

// ── 2. new Linter({ ...rest }) — keep other options ───
const linter2 = new Linter({ allowInlineConfig: false })

// ── 3. new Linter(/* TODO: configType "eslintrc" is removed in ESLint v10, flat config is now the only option */) — add TODO ──────────────────
const linter3 = new Linter(/* TODO: configType "eslintrc" is removed in ESLint v10, flat config is now the only option */)

// ── 4. loadESLint() ────────────────────────────────
const ESLintClass1 = await loadESLint()

// ── 5. loadESLint() ───────────────────────────────
const ESLintClass2 = await loadESLint()

// ── 6. new ESLint({ flags: [] }) ────────────
const eslint1 = new ESLint({ flags: [] })

// ── 7. new ESLint({ flags: ['other'] }) ───
const eslint2 = new ESLint({ flags: ['other-flag'] })

// ── 8. new ESLint({ flags: [] }) ────────
const eslint3 = new ESLint({ flags: [] })

// ── 9. Deprecated Linter methods ─────────────────────────────────────────
const linter = new Linter()
linter.defineParser(/* TODO: defineParser() removed in ESLint v10, no replacement */ 'babel-eslint', require('babel-eslint'))
linter.defineRule(/* TODO: defineRule() removed in ESLint v10, no replacement */ 'no-foo', noFooRule)
linter.defineRules(/* TODO: defineRules() removed in ESLint v10, no replacement */ { 'no-foo': noFooRule, 'no-bar': noBarRule })
const allRules = linter.getRules(/* TODO: getRules() removed in ESLint v10, no replacement */ )

// ── 10. No configType — must NOT be touched ───────────────────────────────
const linterClean = new Linter()
const linterWithOpts = new Linter({ allowInlineConfig: true })
const ESLintClean = await loadESLint()
const eslintNoFlags = new ESLint({ fix: true })
