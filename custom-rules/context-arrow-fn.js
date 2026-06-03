/**
 * PR#8 scenario: create as arrow function (not method shorthand)
 *
 * Real plugins often use `create: (context) => { ... }` instead of
 * `create(context) { ... }`. The codemod matches on the method call
 * pattern regardless of how create is defined.
 *
 * BEFORE codemod:
 *   context.getFilename()  -> context.filename
 *   context.getCwd()       -> context.cwd
 *   context.parserOptions  -> context.languageOptions.parserOptions
 */
'use strict'

module.exports = {
  meta: { type: 'suggestion', schema: [] },
  create: (context) => {
    const filename = context.getFilename()
    const cwd = context.getCwd()
    const opts = context.parserOptions

    return {
      Program: (node) => {
        if (!opts) return
        context.report({ node, message: `${filename} in ${cwd}` })
      },
    }
  },
}
