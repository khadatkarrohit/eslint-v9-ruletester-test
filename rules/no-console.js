'use strict'

module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow console statements' },
    schema: [
      {
        type: 'object',
        properties: {
          allow: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {}
    const allow = options.allow || []

    return {
      MemberExpression(node) {
        if (
          node.object.type === 'Identifier' &&
          node.object.name === 'console' &&
          node.property.type === 'Identifier' &&
          !allow.includes(node.property.name)
        ) {
          context.report({ node, message: 'Unexpected console statement.' })
        }
      },
    }
  },
}
