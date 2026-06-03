/**
 * TypeScript variant: codemod workflow includes **\/*.ts files.
 *
 * BEFORE codemod: FAILS (top-level type throws ConfigError).
 * AFTER codemod:  passes (patterns removed, errors[i].type preserved).
 */
import { RuleTester } from 'eslint'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const noEval = require('../rules/no-eval')

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2020 } })

ruleTester.run('no-eval (ts)', noEval as any, {
  valid: [
    { code: 'safe()', errors: [], output: null },
    { code: 'notEval()', errors: [] },
    { errors: [], code: 'Math.random()' },
  ],
  invalid: [
    // top-level type must be removed
    {
      code: 'eval(x)',
      type: 'CallExpression',
      errors: [{ message: 'eval() is not allowed.' }],
    },
    // type inside errors[i] must NOT be removed
    {
      code: 'eval(y)',
      errors: [{ message: 'eval() is not allowed.', type: 'CallExpression' }],
    },
    // both: only top-level removed
    {
      code: 'eval(z)',
      type: 'CallExpression',
      errors: [{ message: 'eval() is not allowed.', type: 'CallExpression' }],
    },
  ],
})

console.log('typescript tests passed')
