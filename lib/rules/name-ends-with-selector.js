const meta = {
  type: 'suggestion',
  docs: {
    description: 'Selector variable name should end with Selector in its name',
    recommended: true,
  },
};

const create = context => ({
  Identifier(node) {
    if (
      node.name === 'createSelector'
      && node.parent.type !== 'ImportSpecifier'
    ) {
      let cur = node.parent;

      while (cur.type !== 'VariableDeclarator') {
        if (!cur.parent) {
          return;
        }

        cur = cur.parent;
      }

      const selectorVar = cur.id;

      if (selectorVar.name.endsWith('Selector')) {
        return;
      }

      context.report({
        node: selectorVar,
        message: '{{ name }} expected to have Selector at the end',
        data: {
          name: selectorVar.name,
        },
      });
    }
  },
});

module.exports = { meta, create };
