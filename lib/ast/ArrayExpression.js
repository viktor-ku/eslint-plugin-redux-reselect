const ArrayExpression = ({
  elements = [],
}) => ({
  type: ArrayExpression.name,
  elements,
});

ArrayExpression.isSelf = x => x.type === ArrayExpression.name;

exports.ArrayExpression = ArrayExpression;
