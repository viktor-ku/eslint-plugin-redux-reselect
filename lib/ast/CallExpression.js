const CallExpression = ({
  callee,
  args = [],
}) => ({
  type: CallExpression.name,
  callee,
  arguments: args,
});

CallExpression.isSelf = x => x.type === CallExpression.name;

exports.CallExpression = CallExpression;
