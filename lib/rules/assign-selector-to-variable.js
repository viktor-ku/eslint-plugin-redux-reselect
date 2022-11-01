const str = require('../constants');
const { Identifier } = require('../ast/Identifier');
const { VariableDeclarator } = require('../ast/VariableDeclarator');

const meta = {
  type: 'suggestion',
  docs: {
    url:
      "https://github.com/palortoff/eslint-plugin-redux-reselect#redux-reselectassign-selector-to-variable",
  },
};

const create = ({ report }) => ({
  CallExpression(node) {
    if (
      !Identifier.isSelf(node.callee)
      || node.callee.name !== str.createSelector
      || VariableDeclarator.isSelf(node.parent)
    ) {
      return;
    }

    report({
      node: node.callee,
      message: 'Assign `createSelector` result directly to a variable',
    });
  },
});

module.exports = { meta, create };
