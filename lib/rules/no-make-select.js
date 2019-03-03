const meta = {
  type: 'suggestion',
  docs: {
    description: 'Avoid using makeSelect at the start of selector variable name',
    recommended: true,
  },
};

const makeSelect = 'makeSelect';

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

      if (!selectorVar.name.startsWith(makeSelect)) {
        return;
      }

      context.report({
        message: '{{ name }} shouldn\'t have makeSelect at the start',
        loc: {
          start: selectorVar.loc.start,
          end: {
            line: selectorVar.loc.start.line,
            column: selectorVar.loc.start.column + makeSelect.length,
          },
        },
        data: {
          name: selectorVar.name,
        },
      });
    }
  },
});

module.exports = { meta, create };
