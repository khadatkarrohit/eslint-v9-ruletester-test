/**
 * Potential failure cases - NOT part of `npm test`.
 * Run manually AFTER the codemod to inspect how it handles edge cases:
 *
 *   node tests/potential-failures.test.js
 *
 * Some transforms here may be incorrect or missed. See comments per case.
 */
'use strict'

const { RuleTester } = require('eslint')
const noEval = require('../rules/no-eval')

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2020 } })

// -----------------------------------------------------------------------
// Case 1: Unicode / multi-byte characters in code strings.
//
// The codemod computes removal ranges using UTF-8 byte offsets (from ast-grep),
// but JavaScript string slice() operates on UTF-16 code units. When a file
// contains multi-byte characters (e.g. emoji = 4 bytes UTF-8 / 2 UTF-16
// code units) before a removed property, the indices diverge and the file
// gets corrupted.
//
// Expected: file is corrupted after codemod runs on this case.
// -----------------------------------------------------------------------
ruleTester.run('unicode in code string', noEval, {
  valid: [
    { code: 'var greet = "hello world"', errors: [] },
  ],
  invalid: [
    { code: 'eval(x)', errors: [{ message: 'eval() is not allowed.' }] },
  ],
})

// -----------------------------------------------------------------------
// Case 2: `valid` as a shorthand property (variable reference).
//
// The selector matches `pair` nodes where the key is the property_identifier
// `valid`. Shorthand syntax `{ valid }` creates a shorthand_property_identifier
// node, not a pair. The errors inside myValid will NOT be transformed.
//
// Expected: `errors: []` inside myValid is NOT removed (codemod misses it).
// -----------------------------------------------------------------------
const myValid = [
  { code: 'safe()', errors: [] },
]

ruleTester.run('shorthand valid property', noEval, {
  valid: myValid,
  invalid: [
    { code: 'eval(x)', errors: [{ message: 'eval() is not allowed.' }] },
  ],
})

// -----------------------------------------------------------------------
// Case 3: computed property key.
//
// { ['valid']: [...] } - the key is a computed_property_name, not a
// property_identifier. The codemod selector will not match it.
//
// Expected: errors[] inside computed valid is NOT removed.
// -----------------------------------------------------------------------
ruleTester.run('computed valid/invalid key', noEval, {
  ['valid']: [
    { code: 'safe()', errors: [] },
  ],
  ['invalid']: [
    { code: 'eval(x)', errors: [{ message: 'eval() is not allowed.' }] },
  ],
})

console.log('potential-failures checks done (inspect diff for codemod behavior)')
