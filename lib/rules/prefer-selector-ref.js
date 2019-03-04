const meta = {
  type: 'suggestion',
  docs: {
    description: 'Enforces references usage inside createSelector function',
    recommended: true,
  },
};

const CallExpression = 'CallExpression';
const ArrayExpression = 'ArrayExpression';
const VariableDeclarator = 'VariableDeclarator';

const message = 'Selector reference expected, call expression found';

const create = context => ({
  Identifier(node) {
    if (
      node.name === 'createSelector'
      && node.parent.type !== 'ImportSpecifier'
    ) {
      const createSelector = node.parent;

      if (createSelector.type === VariableDeclarator) {
        return;
      }

      const report = (nodeArg) => {
        context.report({
          node: nodeArg,
          message,
        });
      };

      createSelector.arguments.forEach((arg) => {
        if (arg.type === CallExpression) {
          report(arg);
        } else if (arg.type === ArrayExpression) {
          arg.elements.forEach((el) => {
            if (el.type === CallExpression) {
              report(el);
            }
          });
        }
      });
    }
  },
});

module.exports = { meta, create };
