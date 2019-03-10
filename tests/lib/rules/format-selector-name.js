const sinon = require('sinon');
const rule = require('../../../lib/rules/format-selector-name');
const { CallExpression } = require('../../../lib/ast/CallExpression');
const { Identifier } = require('../../../lib/ast/Identifier');
const { VariableDeclarator } = require('../../../lib/ast/VariableDeclarator');
const { ArrayExpression } = require('../../../lib/ast/ArrayExpression');

describe('format-selector-name', () => {
  it('ignore if init is null', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = VariableDeclarator({
      id: Identifier({ name: 'userSelector' }),
      init: null,
    });

    match.VariableDeclarator(node);

    expect(report.callCount).toBe(0);
  });

  it('ignore if init is not a CallExpression', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = VariableDeclarator({
      id: Identifier({ name: 'userSelector' }),
      init: Identifier({ name: 'oh' }),
    });

    match.VariableDeclarator(node);

    expect(report.callCount).toBe(0);
  });

  it('ignore if inits callee is not an Identifier', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = VariableDeclarator({
      id: Identifier({ name: 'userSelector' }),
      init: CallExpression({
        callee: ArrayExpression({
          elements: [],
        }),
      }),
    });

    match.VariableDeclarator(node);

    expect(report.callCount).toBe(0);
  });

  it('ignore if inits callee identifiers name is not `createSelector`', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = VariableDeclarator({
      id: Identifier({ name: 'userSelector' }),
      init: CallExpression({
        callee: Identifier({ name: 'notACreateSelector' }),
      }),
    });

    match.VariableDeclarator(node);

    expect(report.callCount).toBe(0);
  });

  it('perfect scenario when variable name ends with Selector', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = VariableDeclarator({
      id: Identifier({ name: 'userSelector' }),
      init: CallExpression({
        callee: Identifier({ name: 'createSelector' }),
      }),
    });

    match.VariableDeclarator(node);

    expect(report.callCount).toBe(0);
  });

  it('fails when variable name doesn\'s end with Selector', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = VariableDeclarator({
      id: Identifier({ name: 'maybeSelectorAmI' }),
      init: CallExpression({
        callee: Identifier({ name: 'createSelector' }),
      }),
    });

    match.VariableDeclarator(node);

    expect(report.callCount).toBe(1);
  });

  [
    'makeSelect',
    'select',
    'selector',
  ].forEach((name) => {
    it(`fails when variable name starts with '${name}'`, () => {
      const report = sinon.fake();
      const match = rule.create({ report });
      const node = VariableDeclarator({
        id: Identifier({ name: `${name}BooksSelector` }),
        init: CallExpression({
          callee: Identifier({ name: 'createSelector' }),
        }),
      });

      match.VariableDeclarator(node);

      if (name === 'selector') {
        expect(report.callCount).toBe(2);
      } else {
        expect(report.callCount).toBe(1);
      }
    });
  });
});
