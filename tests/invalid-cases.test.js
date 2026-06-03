/**
 * Invalid-case transform:
 *   Top-level `type` on an invalid test case throws ConfigError in v9+ flat-config.
 *   The codemod must remove it.
 *
 *   `type` INSIDE errors[i] is a different thing (asserts the reported node type).
 *   It is valid in v9 and must NOT be touched by this codemod.
 *
 * BEFORE codemod: npm test FAILS (top-level type throws ConfigError).
 * AFTER codemod:  npm test passes (top-level type removed, errors[i].type preserved).
 */
'use strict'

const { RuleTester } = require('eslint')
const rule = require('../rules/no-eval')

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2020 } })

ruleTester.run('no-eval', rule, {
  valid: [
    { code: 'safe()' },
    'notEval()',
  ],

  invalid: [
    // --- no-transform: no type prop at all ---
    { code: 'eval(a)', errors: [{ message: 'eval() is not allowed.' }] },

    // --- no-transform: output in INVALID case must NOT be removed ---
    // output: null means no autofix is expected; cleanup-valid-cases.ts is scoped to the
    // valid array only and must never touch output in invalid cases.
    { code: 'eval(a2)', errors: [{ message: 'eval() is not allowed.' }], output: null },

    // --- no-transform: type ONLY inside errors[i] (must NOT be removed) ---
    { code: 'eval(b)', errors: [{ message: 'eval() is not allowed.', type: 'CallExpression' }] },

    // --- remove type as first property ---
    { type: 'CallExpression', code: 'eval(c)', errors: [{ message: 'eval() is not allowed.' }] },

    // --- remove type in the middle ---
    { code: 'eval(d)', type: 'CallExpression', errors: [{ message: 'eval() is not allowed.' }] },

    // --- remove type as last property ---
    { code: 'eval(e)', errors: [{ message: 'eval() is not allowed.' }], type: 'CallExpression' },

    // --- remove top-level type, keep type inside errors[i] ---
    {
      code: 'eval(f)',
      type: 'CallExpression',
      errors: [{ message: 'eval() is not allowed.', type: 'CallExpression' }],
    },

    // --- multiple errors with type inside first entry (eval called twice) ---
    {
      code: 'eval(x); eval(y)',
      type: 'CallExpression',
      errors: [
        { message: 'eval() is not allowed.', type: 'CallExpression' },
        { message: 'eval() is not allowed.' },
      ],
    },

    // --- multiline invalid case with top-level type ---
    {
      code: 'eval(h)',
      type: 'CallExpression',
      errors: [
        { message: 'eval() is not allowed.' },
      ],
    },
  ],
})

console.log('invalid-cases tests passed')
