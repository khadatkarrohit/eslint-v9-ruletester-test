import { Linter, ESLint, loadESLint } from 'eslint'

// ══ Quote variants ════════════════════════════════════════════════════════════
const a1 = new Linter()
const a2 = new Linter()
const a3 = new Linter()

// ══ configType: 'flat' + other options — various positions ════════════════════
const a4 = new Linter({ allowInlineConfig: true })
const a5 = new Linter({ allowInlineConfig: true })
const a6 = new Linter({ allowInlineConfig: true, noInlineConfig: false })

// ══ configType: 'eslintrc' both quote styles ══════════════════════════════════
const a7 = new Linter(/* TODO: configType "eslintrc" is removed in ESLint v10, flat config is now the only option */)
const a8 = new Linter(/* TODO: configType "eslintrc" is removed in ESLint v10, flat config is now the only option */)

// ══ Multiline constructor ════════════════════════════════════════════════════
const a9 = new Linter()

// ══ Extra whitespace ════════════════════════════════════════════════════════
const a10 = new Linter()

// ══ NOT Linter — must NOT be touched ════════════════════════════════════════
const a11 = new MyLinter({ configType: 'flat' })
const a12 = new ESLintLinter({ configType: 'flat' })

// ══ configType as variable — must NOT be touched ═════════════════════════════
const myType = 'flat'
const a13 = new Linter({ configType: myType })

// ══ No configType — must NOT be touched ══════════════════════════════════════
const a14 = new Linter()
const a15 = new Linter({ allowInlineConfig: true })

// ══ loadESLint: both values ════════════════════════════════════════════════
const b1 = await loadESLint()
const b2 = await loadESLint()
const b3 = loadESLint()

// ══ loadESLint with other options — LIMITATION: not transformed ═══════════
const b4 = await loadESLint({ useFlatConfig: true, foo: 'bar' })

// ══ loadESLint useFlatConfig as variable — must NOT be touched ═══════════
const b5 = await loadESLint({ useFlatConfig: myFlag })

// ══ loadESLint no useFlatConfig — must NOT be touched ═════════════════════
const b6 = await loadESLint()
const b7 = await loadESLint({ foo: 'bar' })

// ══ ESLint flags: single removed ═════════════════════════════════════════
const c1 = new ESLint({ flags: [] })
const c2 = new ESLint({ flags: [] })

// ══ ESLint flags: removed + valid ════════════════════════════════════════
const c3 = new ESLint({ flags: ['other-flag'] })
const c4 = new ESLint({ flags: ['other-flag'] })

// ══ ESLint flags: both removed ═══════════════════════════════════════════
const c5 = new ESLint({ flags: [] })

// ══ ESLint flags: empty array — must NOT be touched ══════════════════════
const c6 = new ESLint({ flags: [] })

// ══ ESLint flags: variable — must NOT be touched ══════════════════════════
const c7 = new ESLint({ flags: myFlags })

// ══ ESLint no flags — must NOT be touched ════════════════════════════════
const c8 = new ESLint({ fix: true })

// ══ Deprecated Linter methods ═════════════════════════════════════════════
const linter = new Linter()
linter.defineParser(/* TODO: defineParser() removed in ESLint v10, no replacement */ 'babel-eslint', require('babel-eslint'))
linter.defineRule(/* TODO: defineRule() removed in ESLint v10, no replacement */ 'no-foo', noFooRule)
linter.defineRules(/* TODO: defineRules() removed in ESLint v10, no replacement */ { 'no-foo': noFooRule })
const rules = linter.getRules(/* TODO: getRules() removed in ESLint v10, no replacement */ )

// ══ Deprecated methods on different variable name ══════════════════════
const myLinter = new Linter()
myLinter.defineRule(/* TODO: defineRule() removed in ESLint v10, no replacement */ 'no-bar', noBarRule)

// ══ Deprecated methods inside function ══════════════════════════════════
function setup(l) {
  l.defineParser(/* TODO: defineParser() removed in ESLint v10, no replacement */ 'custom-parser', parser)
  l.defineRules(/* TODO: defineRules() removed in ESLint v10, no replacement */ { 'custom-rule': rule })
}

// ══ Valid methods — must NOT be touched ══════════════════════════════════
linter.verify('const x = 1', {})
linter.verifyAndFix('const x = 1', {})
