/**
 * PR#8 scenario: SourceCode methods with optional skip argument
 *
 * BEFORE codemod:
 *   sourceCode.getTokenOrCommentBefore(node, 1) -> sourceCode.getTokenBefore(node, { includeComments: true, skip: 1 })
 *   sourceCode.getTokenOrCommentAfter(node, 2)  -> sourceCode.getTokenAfter(node, { includeComments: true, skip: 2 })
 */
'use strict'

module.exports = {
  meta: { type: 'suggestion', schema: [] },
  create(context) {
    const sourceCode = context.sourceCode

    return {
      CallExpression(node) {
        const before = sourceCode.getTokenOrCommentBefore(node, 1)
        const after = sourceCode.getTokenOrCommentAfter(node, 2)

        if (before && after) {
          context.report({ node, message: 'found' })
        }
      },
    }
  },
}
