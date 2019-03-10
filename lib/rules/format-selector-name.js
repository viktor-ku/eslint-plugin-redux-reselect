const str = require('../constants');
const { CallExpression } = require('../ast/CallExpression');
const { Identifier } = require('../ast/Identifier');

const meta = {
  type: 'suggestion',
};

const create = ({ report }) => ({
  VariableDeclarator(node) {
    if (
      !node.init
      || !CallExpression.isSelf(node.init)
      || !Identifier.isSelf(node.init.callee)
      || node.init.callee.name !== str.createSelector
    ) {
      return;
    }

    const varNameLow = node.id.name.toLowerCase();
    const varName = node.id.name;

    if (!varNameLow.endsWith('selector')) {
      report({
        node: node.id,
        message: 'Expected to have `Selector` at the end of `{{ name }}`',
        data: {
          name: varName,
        },
      });
    }

    // Yeah, could've just inserted the forEach, but 3 ifs is just so much faster
    if (varNameLow.startsWith('makeselect')) {
      report({
        node: node.id,
        message: 'Unexpected `{{ actual }}` at the start of `{{ name }}`',
        data: {
          name: varName,
          actual: varName.slice(0, 10),
        },
      });
    }
    if (varNameLow.startsWith('select')) {
      report({
        node: node.id,
        message: 'Unexpected `{{ actual }}` at the start of `{{ name }}`',
        data: {
          name: varName,
          actual: varName.slice(0, 6),
        },
      });
    }
    if (varNameLow.startsWith('selector')) {
      report({
        node: node.id,
        message: 'Unexpected `{{ actual }}` at the start of `{{ name }}`',
        data: {
          name: varName,
          actual: varName.slice(0, 8),
        },
      });
    }
  },
});

module.exports = { meta, create };
