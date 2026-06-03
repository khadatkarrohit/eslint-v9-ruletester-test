/**
 * PR#8 scenario: deprecated context methods nested inside other expressions
 *
 * All other fixtures assign to a variable first. Real code also calls
 * deprecated methods inline — inside report(), if conditions, etc.
 *
 * BEFORE codemod:
 *   context.report({ message: context.getFilename() })
 *     -> context.report({ message: context.filename })
 *
 *   if (context.getCwd().startsWith('/home'))
 *     -> if (context.cwd.startsWith('/home'))
 *
 *   const isTs = context.getFilename().endsWith('.ts')
 *     -> const isTs = context.filename.endsWith('.ts')
 *
 *   const text = context.getSourceCode().getText(node)
 *     -> const text = context.sourceCode.getText(node)
 */
'use strict'

module.exports = {
  meta: { type: 'suggestion', schema: [] },
  create(context) {
    return {
      Program(node) {
        context.report({ node, message: context.getFilename() })

        if (context.getCwd().startsWith('/home')) {
          return
        }

        const isTs = context.getFilename().endsWith('.ts')
        const text = context.getSourceCode().getText(node)

        if (isTs && text) {
          context.report({ node, message: 'ts file' })
        }
      },
    }
  },
}
