/**
 * PR#8 scenario: nullish-coalescing fallback patterns emitted by the v8->v9 codemod
 *
 * BEFORE codemod:
 *   context.filename ?? context.getFilename()                   -> context.filename
 *   context.physicalFilename ?? context.getPhysicalFilename()   -> context.physicalFilename
 *   context.cwd ?? context.getCwd()                            -> context.cwd
 *   context.sourceCode ?? context.getSourceCode()              -> context.sourceCode
 */
'use strict'

module.exports = {
  meta: { type: 'suggestion', schema: [] },
  create(context) {
    const filename = context.filename ?? context.getFilename()
    const physicalFilename = context.physicalFilename ?? context.getPhysicalFilename()
    const cwd = context.cwd ?? context.getCwd()
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    return {
      Program(node) {
        context.report({ node, message: `${filename} in ${cwd}` })
      },
    }
  },
}
