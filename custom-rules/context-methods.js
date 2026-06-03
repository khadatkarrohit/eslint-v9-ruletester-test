/**
 * PR#8 scenario: deprecated context methods -> property access
 *
 * BEFORE codemod:
 *   context.getFilename()         -> context.filename
 *   context.getPhysicalFilename() -> context.physicalFilename
 *   context.getCwd()              -> context.cwd
 *   context.getSourceCode()       -> context.sourceCode
 *   context.parserOptions         -> context.languageOptions.parserOptions
 */
'use strict'

module.exports = {
  meta: { type: 'suggestion', schema: [] },
  create(context) {
    const filename = context.getFilename()
    const physicalFilename = context.getPhysicalFilename()
    const cwd = context.getCwd()
    const sourceCode = context.getSourceCode()
    const opts = context.parserOptions

    return {
      Program(node) {
        if (!opts) return
        context.report({ node, message: `File: ${filename}, cwd: ${cwd}` })
      },
    }
  },
}
