const sinon = require('sinon');
const rule = require('../../../lib/rules/prefer-selector-ref');
const { CallExpression } = require('../../../lib/ast/CallExpression');
const { Identifier } = require('../../../lib/ast/Identifier');
const { ArrowFunctionExpression } = require('../../../lib/ast/ArrowFunctionExpression.js');
const { ArrayExpression } = require('../../../lib/ast/ArrayExpression');

describe('prefer-selector-ref', () => {
  it('should be ok when id name is not createSelector', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = CallExpression({
      callee: Identifier({ name: 'foo' }),
      args: [],
    });

    match.CallExpression(node);

    expect(report.callCount).toBe(0);
  });

  it('should be ok when no arguments', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = CallExpression({
      callee: Identifier({ name: 'createSelector' }),
      args: [],
    });

    match.CallExpression(node);

    expect(report.callCount).toBe(0);
  });

  it('should be ok when you pass a number of selector refs', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = CallExpression({
      callee: Identifier({ name: 'createSelector' }),
      args: [
        Identifier({ name: 'oneSelector' }),
        Identifier({ name: 'twoSelector' }),
        Identifier({ name: 'threeSelector' }),
      ],
    });

    match.CallExpression(node);

    expect(report.callCount).toBe(0);
  });

  it('should be ok when you pass first argument as array', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = CallExpression({
      callee: Identifier({ name: 'createSelector' }),
      args: [
        ArrayExpression({
          elements: [],
        }),
        Identifier({ name: 'threeSelector' }),
        ArrayExpression({
          elements: [],
        }),
      ],
    });

    match.CallExpression(node);

    expect(report.callCount).toBe(1);

    const reportData = report.args[0][0];
    expect(reportData.messageId).toEqual('preferRef');
    expect(reportData.data).toEqual({
      type: ArrayExpression.name,
    });
  });

  it('should be ok when you pass last argument as an arrow function', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = CallExpression({
      callee: Identifier({ name: 'createSelector' }),
      args: [
        Identifier({ name: 'threeSelector' }),
        Identifier({ name: 'threeSelector' }),
        ArrowFunctionExpression(),
        Identifier({ name: 'threeSelector' }),
        ArrowFunctionExpression(),
      ],
    });

    match.CallExpression(node);

    expect(report.callCount).toBe(1);

    const reportData = report.args[0][0];
    expect(reportData.messageId).toEqual('preferRef');
    expect(reportData.data).toEqual({
      type: ArrowFunctionExpression.name,
    });
  });

  it('perfect scenario #1 with array of selectors and a combiner', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = CallExpression({
      callee: Identifier({ name: 'createSelector' }),
      args: [
        ArrayExpression({
          elements: [
            Identifier({ name: 'oneSelector' }),
            Identifier({ name: 'twoSelector' }),
            Identifier({ name: 'twoSelector' }),
          ],
        }),
        ArrowFunctionExpression(),
      ],
    });

    match.CallExpression(node);

    expect(report.callCount).toBe(0);
  });

  it('perfect scenario #2 with selectors and a combiner', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = CallExpression({
      callee: Identifier({ name: 'createSelector' }),
      args: [
        Identifier({ name: 'oneSelector' }),
        Identifier({ name: 'twoSelector' }),
        Identifier({ name: 'twoSelector' }),
        ArrowFunctionExpression(),
      ],
    });

    match.CallExpression(node);

    expect(report.callCount).toBe(0);
  });

  it('should fail to pass anything else other than Identifiers into first array', () => {
    const report = sinon.fake();
    const match = rule.create({ report });
    const node = CallExpression({
      callee: Identifier({ name: 'createSelector' }),
      args: [
        ArrayExpression({
          elements: [
            ArrayExpression({
              elements: [
                Identifier({ name: 'oneSelector' }),
              ],
            }),
            Identifier({ name: 'oneSelector' }),
            CallExpression({
              callee: Identifier({ name: 'wut' }),
            }),
            Identifier({ name: 'oneSelector' }),
            ArrowFunctionExpression(),
          ],
        }),
        ArrowFunctionExpression(),
      ],
    });

    match.CallExpression(node);

    expect(report.callCount).toBe(3);

    const expectedFails = [{
      messageId: 'preferRef',
      type: ArrayExpression.name,
    }, {
      messageId: 'preferRef',
      type: CallExpression.name,
    }, {
      messageId: 'preferRef',
      type: ArrowFunctionExpression.name,
    }];

    report.args.forEach((arg, index) => {
      const [argument] = arg;
      const expected = expectedFails[index];

      expect(argument.messageId).toBe(expected.messageId);
      expect(argument.data.type).toBe(expected.type);
    });
  });
});
