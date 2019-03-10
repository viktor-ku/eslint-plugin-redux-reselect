const sinon = require('sinon');
const rule = require('../../../lib/rules/assign-selector-to-variable');
const { CallExpression } = require('../../../lib/ast/CallExpression');
const { Identifier } = require('../../../lib/ast/Identifier');
const { VariableDeclarator } = require('../../../lib/ast/VariableDeclarator');
const { ArrowFunctionExpression } = require('../../../lib/ast/ArrowFunctionExpression');

describe('assign-selector-to-variable', () => {
  it('ignore when call expression is not a createSelector', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = CallExpression({
      callee: Identifier({ name: 'foo' }),
      args: [],
    });

    match.CallExpression(node);

    expect(report.callCount).toBe(0);
  });

  it('ok when parent is a VariableDeclarator', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = {
      ...CallExpression({
        callee: Identifier({ name: 'createSelector' }),
        args: [],
      }),
      parent: VariableDeclarator({}),
    };

    match.CallExpression(node);

    expect(report.callCount).toBe(0);
  });

  it('fails when parent is something other', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = {
      ...CallExpression({
        callee: Identifier({ name: 'createSelector' }),
        args: [],
      }),
      parent: ArrowFunctionExpression({}),
    };

    match.CallExpression(node);

    expect(report.callCount).toBe(1);
  });
});
