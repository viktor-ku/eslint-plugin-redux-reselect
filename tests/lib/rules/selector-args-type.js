const sinon = require('sinon');
const rule = require('../../../lib/rules/selector-args-type');
const { CallExpression } = require('../../../lib/ast/CallExpression');
const { Identifier } = require('../../../lib/ast/Identifier');
const { VariableDeclarator } = require('../../../lib/ast/VariableDeclarator');
const { ArrowFunctionExpression } = require('../../../lib/ast/ArrowFunctionExpression');
const { ArrayExpression } = require('../../../lib/ast/ArrayExpression');

describe('selector-args-type', () => {
  it('ignore if call expression callee is not a createSelector', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = CallExpression({
      callee: Identifier({ name: 'foo' }),
      args: [],
    });

    match.CallExpression(node);

    expect(report.callCount).toBe(0);
  });

  describe('args', () => {
    const options = ['args'];

    it('fails when no arguments passed', () => {
      const report = sinon.fake();
      const match = rule.create({ report, options });
      const node = CallExpression({
        callee: Identifier({ name: 'createSelector' }),
        args: [],
      });

      match.CallExpression(node);

      expect(report.callCount).toBe(1);
    });

    it('ok when we pass a bunch of references', () => {
      const report = sinon.fake();
      const match = rule.create({ report, options });
      const node = CallExpression({
        callee: Identifier({ name: 'createSelector' }),
        args: [
          Identifier({ name: 'oneSelector' }),
          Identifier({ name: 'twoSelector' }),
          Identifier({ name: 'threeSelector' }),
          ArrowFunctionExpression(),
        ],
      });

      match.CallExpression(node);

      expect(report.callCount).toBe(0);
    });

    it('fails when we pass an array as a first argument', () => {
      const report = sinon.fake();
      const match = rule.create({ report, options });
      const node = CallExpression({
        callee: Identifier({ name: 'createSelector' }),
        args: [
          ArrayExpression({
            elements: [],
          }),
          ArrowFunctionExpression(),
        ],
      });

      match.CallExpression(node);

      expect(report.callCount).toBe(1);
    });
  });

  describe('array', () => {
    const options = ['array'];

    it('fails when no arguments passed', () => {
      const report = sinon.fake();
      const match = rule.create({ report, options });
      const node = CallExpression({
        callee: Identifier({ name: 'createSelector' }),
        args: [],
      });

      match.CallExpression(node);

      expect(report.callCount).toBe(1);
    });

    it('ok when we pass one array as a first argument', () => {
      const report = sinon.fake();
      const match = rule.create({ report, options });
      const node = CallExpression({
        callee: Identifier({ name: 'createSelector' }),
        args: [
          ArrayExpression({
            elements: [],
          }),
          ArrowFunctionExpression(),
        ],
      });

      match.CallExpression(node);

      expect(report.callCount).toBe(0);
    });

    it('fails when we pass a bunch of references', () => {
      const report = sinon.fake();
      const match = rule.create({ report, options });
      const node = CallExpression({
        callee: Identifier({ name: 'createSelector' }),
        args: [
          Identifier({ name: 'oneSelector' }),
          Identifier({ name: 'twoSelector' }),
          Identifier({ name: 'threeSelector' }),
          ArrowFunctionExpression(),
        ],
      });

      match.CallExpression(node);

      expect(report.callCount).toBe(4);
    });

    it('report outside of array references', () => {
      const report = sinon.fake();
      const match = rule.create({ report, options });
      const node = CallExpression({
        callee: Identifier({ name: 'createSelector' }),
        args: [
          ArrayExpression({
            elements: [],
          }),
          Identifier({ name: 'oneSelector' }),
          Identifier({ name: 'twoSelector' }),
          Identifier({ name: 'threeSelector' }),
          ArrowFunctionExpression(),
          ArrowFunctionExpression(),
        ],
      });

      match.CallExpression(node);

      expect(report.callCount).toBe(4);
    });
  });
});
