/**
 * Combined: both valid-case and invalid-case patterns in the same file.
 * Structural edge cases:
 *   - multiple ruleTester.run() calls in one file
 *   - multiple tester variables
 *   - inline new RuleTester().run()
 *   - two different rules in the same file
 *
 * BEFORE codemod: FAILS (top-level type in invalid throws).
 * AFTER codemod:  passes (both pattern types removed).
 */
'use strict'

const { RuleTester } = require('eslint')
const noConsole = require('../rules/no-console')
const noVar = require('../rules/no-var')

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2020 } })

// === Run 1: no-console rule ===

ruleTester.run('no-console', noConsole, {
  valid: [
    'var x = 1',
    { code: 'let y = 2' },
    { code: 'const a = 1', errors: [] },
    { code: 'const b = 2', output: null },
    { code: 'const c = 3', errors: [], output: null },
    { errors: [], code: 'const d = 4' },
    { code: 'window.alert(x)', options: [{ allow: ['alert'] }], errors: [] },
  ],
  invalid: [
    { code: 'console.log(x)', errors: [{ message: 'Unexpected console statement.' }] },
    {
      code: 'console.error(y)',
      type: 'MemberExpression',
      errors: [{ message: 'Unexpected console statement.' }],
    },
  ],
})

// === Run 2: no-var, different tester variable ===

const anotherTester = new RuleTester({ languageOptions: { ecmaVersion: 2020 } })

anotherTester.run('no-var', noVar, {
  valid: [
    { code: 'const x = 1', errors: [] },
    { code: 'let y = 2', output: null },
    { errors: [], output: null, code: 'const z = 3' },
  ],
  invalid: [
    {
      type: 'VariableDeclaration',
      code: 'var a = 1',
      errors: [{ message: 'Unexpected var, use let or const instead.' }],
    },
    {
      code: 'var b = 2',
      errors: [{ message: 'Unexpected var, use let or const instead.' }],
      type: 'VariableDeclaration',
    },
    {
      code: 'var c = 3',
      errors: [{ message: 'Unexpected var, use let or const instead.' }],
    },
  ],
})

// === Run 3: inline tester ===

new RuleTester({ languageOptions: { ecmaVersion: 2020 } }).run('no-var #inline', noVar, {
  valid: [
    { code: 'const d = 4', errors: [] },
  ],
  invalid: [
    {
      code: 'var e = 5',
      type: 'VariableDeclaration',
      errors: [{ message: 'Unexpected var, use let or const instead.' }],
    },
  ],
})

console.log('combined tests passed')
