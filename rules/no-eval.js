'use strict'

module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow eval()' },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'eval') {
          context.report({ node, message: 'eval() is not allowed.' })
        }
      },
    }
  },
}
