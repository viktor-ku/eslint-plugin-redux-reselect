const meta = {
  type: 'suggestion',
  docs: {
    description: 'Enforces selector output to be assigned directly to the selector function',
    recommended: true,
  },
};

const create = context => ({
  Identifier(node) {
    if (
      node.name === 'createSelector'
      && node.parent.parent.type !== 'VariableDeclarator'
      && node.parent.type !== 'ImportSpecifier'
    ) {
      context.report({
        loc: {
          start: node.parent.parent.loc.start,
          end: node.loc.end,
        },
        message: 'Assign createSelector result to a variable',
      });
    }
  },
});

module.exports = { meta, create };
