/**
 * PR#8 potential failure: context.getSourceCode() chained with deprecated sourceCode methods.
 *
 * Step 1 (replace-context-methods.ts) correctly transforms context.getSourceCode():
 *   context.getSourceCode().getTokenOrCommentBefore(node)
 *     -> context.sourceCode.getTokenOrCommentBefore(node)
 *
 * BUT Step 2 (replace-sourcecode-methods.ts) then MISSES the result.
 *
 * Root cause: the selector matches `call_expression has { member_expression has { property_identifier } }`.
 * When the member expression is double-level (context.sourceCode.getMethod), the inner nested
 * member_expression (context.sourceCode) is found first and it does not have the deprecated
 * property — so the selector does not fire.
 *
 * Workaround: assign getSourceCode() to a variable first, then call the deprecated method on it.
 * That produces a single-level member expression which Step 2 correctly transforms.
 *
 * Run manually and inspect git diff to observe the partial transform.
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
