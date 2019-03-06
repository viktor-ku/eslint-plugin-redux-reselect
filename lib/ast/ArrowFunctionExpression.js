const str = require('../constants');

const ArrowFunctionExpression = () => ({
  type: str.ArrowFunctionExpression,
});

ArrowFunctionExpression.isSelf = x => x.type === str.ArrowFunctionExpression;

exports.ArrowFunctionExpression = ArrowFunctionExpression;
