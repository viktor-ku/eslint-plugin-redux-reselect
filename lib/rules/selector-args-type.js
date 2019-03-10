const str = require('../constants');
const { Identifier } = require('../ast/Identifier');
const { ArrayExpression } = require('../ast/ArrayExpression');
const { ArrowFunctionExpression } = require('../ast/ArrowFunctionExpression');

const meta = {
  type: 'suggestion',
};

const create = ({ report, options }) => ({
  CallExpression(node) {
    if (
      !Identifier.isSelf(node.callee)
      || node.callee.name !== str.createSelector
    ) {
      return;
    }

    const args = node.arguments.slice();
    const firstArg = args[0];
    const expectArray = options[0] === 'array';

    if (!firstArg) {
      if (expectArray) {
        report({
          node,
          message: 'Expected to get an array as a first argument',
        });
      } else {
        report({
          node,
          message: 'Expected to have selectors passed to the function',
        });
      }
      return;
    }

    const lastArg = args[args.length - 1];

    if (ArrowFunctionExpression.isSelf(lastArg)) {
      args.pop();
    }

    if (expectArray) {
      if (ArrayExpression.isSelf(firstArg)) {
        args.shift();
      } else {
        report({
          node: firstArg,
          message: 'Expected to get an array as a first argument, but got `{{ type }}`',
          data: {
            type: firstArg.type,
          },
        });
      }

      args
        .forEach((arg) => {
          if (Identifier.isSelf(arg)) {
            report({
              node: arg,
              message: 'Move selector into the root level array',
            });
          } else {
            report({
              node: arg,
              message: 'Illegal node type at the root!',
            });
          }
        });
    } else if (ArrayExpression.isSelf(firstArg)) {
      report({
        node: firstArg,
        message: 'Pass selectors that are inside of the array directly to the function',
      });
    }
  },
});

module.exports = { meta, create };
