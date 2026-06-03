/**
 * Valid-case transform:
 *   errors / output on a valid case is silently ignored in v9 but throws in v10.
 *   The codemod must remove those properties.
 *
 * BEFORE codemod: npm test passes (v9 silently ignores errors/output in valid).
 * AFTER codemod:  npm test passes (properties removed cleanly).
 */
'use strict'

const { RuleTester } = require('eslint')
const rule = require('../rules/no-eval')

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2020 } })

ruleTester.run('no-eval', rule, {
  valid: [
    // --- no-transform: string shorthand ---
    'safe()',

    // --- no-transform: clean object ---
    { code: 'notEval()' },

    // --- no-transform: object with options only ---
    { code: 'notEval(x)', options: [] },

    // --- errors only (remove errors) ---
    { code: 'Math.random()', errors: [] },

    // --- errors non-empty (still invalid in valid, remove it) ---
    { code: 'parseInt(x)', errors: [{ message: 'stale' }] },

    // --- output only (remove output) ---
    { code: 'JSON.stringify(x)', output: null },

    // --- output with non-null value (remove output) ---
    { code: 'JSON.parse(s)', output: 'JSON.parse(s)' },

    // --- both errors and output (remove both) ---
    { code: 'Number(x)', errors: [], output: null },

    // --- both with non-trivial values (remove both) ---
    { code: 'String(y)', errors: [{ message: 'oops' }], output: 'String(y)' },

    // --- errors as first property: trailing comma removed ---
    { errors: [], code: 'Boolean(z)' },

    // --- output as first property ---
    { output: null, code: 'Array.from(x)' },

    // --- both as first, code at end ---
    { errors: [], output: null, code: 'Object.keys(x)' },

    // --- errors in middle (preceding comma removed) ---
    { code: 'parseFloat(x)', errors: [], options: [] },

    // --- output in middle ---
    { code: 'isNaN(x)', output: null, options: [] },

    // --- options must survive: remove errors alongside options ---
    { code: 'encodeURI(x)', options: [], errors: [] },

    // --- options must survive: remove output alongside options ---
    { code: 'decodeURI(x)', options: [], output: null },

    // --- options must survive: remove both alongside options ---
    { code: 'encodeURIComponent(x)', options: [], errors: [], output: null },

    // --- multiline: remove errors and output (each on own line) ---
    {
      code: 'Array.isArray(x)',
      errors: [],
      output: null,
    },

    // --- multiline: errors as first prop ---
    {
      errors: [],
      code: 'isFinite(x)',
    },
  ],

  invalid: [
    // --- no-transform: no type prop ---
    { code: 'eval(x)', errors: [{ message: 'eval() is not allowed.' }] },
  ],
})

console.log('valid-cases tests passed')
