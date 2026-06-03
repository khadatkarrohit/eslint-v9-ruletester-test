'use strict'

module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Require let or const instead of var' },
    schema: [],
  },
  create(context) {
    return {
      VariableDeclaration(node) {
        if (node.kind === 'var') {
          context.report({ node, message: 'Unexpected var, use let or const instead.' })
        }
      },
    }
  },
}
