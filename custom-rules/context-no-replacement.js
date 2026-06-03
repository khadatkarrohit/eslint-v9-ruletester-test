/**
 * PR#8 scenario: removed properties with no direct replacement
 *
 * BEFORE codemod:
 *   context.parserPath -> context.parserPath /* TODO: removed, no replacement *\/
 *
 * After the codemod, search for TODO and handle manually.
 */
'use strict'

module.exports = {
  meta: { type: 'suggestion', schema: [] },
  create(context) {
    return {
      Program(node) {
        const parser = context.parserPath
        if (context.parserPath === 'espree') {
          return
        }
        context.report({ node, message: `parser: ${parser}` })
      },
    }
  },
}
