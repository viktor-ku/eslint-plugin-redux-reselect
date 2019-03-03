const meta = {
  type: 'suggestion',
  docs: {
    description: 'Enforces references usage inside createSelector function',
    recommended: true,
  },
};

const create = context => ({
  Identifier(node) {
    if (
      node.name === 'createSelector'
      && node.parent.type !== 'ImportSpecifier'
    ) {
      const createSelector = node.parent;

      createSelector.arguments.forEach((arg) => {
        if (arg.type === 'CallExpression') {
          context.report({
            node: arg,
            message: 'Selector reference expected, call expression found',
          });
        }
      });
    }
  },
});

module.exports = { meta, create };
