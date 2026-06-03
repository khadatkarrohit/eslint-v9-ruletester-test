/**
 * PR#8 scenario: context.getSourceCode() chained directly with deprecated sourceCode methods.
 *
 * When both scripts run sequentially:
 *   Step 1 (replace-context-methods.ts):
 *     context.getSourceCode().getTokenOrCommentBefore(node)
 *       -> context.sourceCode.getTokenOrCommentBefore(node)
 *
 *   Step 2 (replace-sourcecode-methods.ts):
 *     context.sourceCode.getTokenOrCommentBefore(node)
 *       -> context.sourceCode.getTokenBefore(node, { includeComments: true })
 *
 * Final result after both steps:
 *   context.getSourceCode().getTokenOrCommentBefore(node)
 *     -> context.sourceCode.getTokenBefore(node, { includeComments: true })
 *
 * Note: Step 2 uses children() instead of find() to get the direct callee
 * member_expression. find() uses DFS and would return the inner ctx.sourceCode
 * node first, extracting "sourceCode" as the method name and skipping the transform.
 */
'use strict'

module.exports = {
  meta: { type: 'suggestion', schema: [] },
  create(context) {
    return {
      CallExpression(node) {
        const before = context.getSourceCode().getTokenOrCommentBefore(node)
        const after = context.getSourceCode().getTokenOrCommentAfter(node)
        const space = context.getSourceCode().isSpaceBetweenTokens(before, after)

        if (space) {
          context.report({ node, message: 'spacing found' })
        }
      },
    }
  },
}
