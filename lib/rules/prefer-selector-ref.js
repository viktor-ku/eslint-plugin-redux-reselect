const str = require('../constants');
const { Identifier } = require('../ast/Identifier');
const { ArrayExpression } = require('../ast/ArrayExpression');
const { ArrowFunctionExpression } = require('../ast/ArrowFunctionExpression');

const meta = {
  type: 'suggestion',
  messages: {
    preferRef: 'Selector reference expected, {{ type }} found',
  },
  docs: {
    url:
      "https://github.com/palortoff/eslint-plugin-redux-reselect#redux-reselectprefer-selector-ref",
  },
};

const create = ({ report }) => ({
  CallExpression(node) {
    if (
      !Identifier.isSelf(node.callee)
      || node.callee.name !== str.createSelector
      || !node.arguments.length
    ) {
      return;
    }

    const toCheck = node.arguments.slice();

    const firstArgument = node.arguments[0];
    if (ArrayExpression.isSelf(firstArgument)) {
      firstArgument.skip = true;
      toCheck.push(...firstArgument.elements);
    }

    const lastArgument = node.arguments[node.arguments.length - 1];
    if (ArrowFunctionExpression.isSelf(lastArgument)) {
      lastArgument.skip = true;
    }

    toCheck
      .filter(arg => !Identifier.isSelf(arg))
      .filter(arg => !arg.skip)
      .forEach((arg) => {
        report({
          node: arg,
          messageId: 'preferRef',
          data: {
            type: arg.type,
          },
        });
      });
  },
});

module.exports = { meta, create };
