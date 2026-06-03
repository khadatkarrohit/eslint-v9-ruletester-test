/**
 * PR#8 scenario: deprecated SourceCode methods
 *
 * BEFORE codemod:
 *   sourceCode.getTokenOrCommentBefore(node)  -> sourceCode.getTokenBefore(node, { includeComments: true })
 *   sourceCode.getTokenOrCommentAfter(node)   -> sourceCode.getTokenAfter(node, { includeComments: true })
 *   sourceCode.isSpaceBetweenTokens(a, b)     -> sourceCode.isSpaceBetween(a, b)
 *   sourceCode.getJSDocComment(node)          -> (null /* TODO: removed, no replacement *\/)
 */
'use strict'

module.exports = {
  meta: { type: 'suggestion', schema: [] },
  create(context) {
    const sourceCode = context.sourceCode

    return {
      CallExpression(node) {
        const before = sourceCode.getTokenOrCommentBefore(node)
        const after = sourceCode.getTokenOrCommentAfter(node)
        const space = sourceCode.isSpaceBetweenTokens(before, after)
        const doc = sourceCode.getJSDocComment(node)

        if (space && !doc) {
          context.report({ node, message: 'spacing issue' })
        }
      },
    }
  },
}
