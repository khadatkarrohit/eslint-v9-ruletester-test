/**
 * PR#8 scenario: chained access after deprecated SourceCode methods
 *
 * BEFORE codemod:
 *   sourceCode.getTokenOrCommentBefore(node).value -> sourceCode.getTokenBefore(node, { includeComments: true }).value
 *   sourceCode.getTokenOrCommentAfter(node).type   -> sourceCode.getTokenAfter(node, { includeComments: true }).type
 */
'use strict'

module.exports = {
  meta: { type: 'suggestion', schema: [] },
  create(context) {
    const sourceCode = context.sourceCode

    return {
      CallExpression(node) {
        const prevValue = sourceCode.getTokenOrCommentBefore(node).value
        const nextType = sourceCode.getTokenOrCommentAfter(node).type

        if (prevValue === '(' && nextType === 'Punctuator') {
          context.report({ node, message: 'found' })
        }
      },
    }
  },
}
