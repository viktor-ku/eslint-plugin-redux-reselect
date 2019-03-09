const VariableDeclarator = ({
  id,
  init = null,
}) => ({
  type: VariableDeclarator.name,
  id,
  init,
});

VariableDeclarator.isSelf = x => x.type === VariableDeclarator.name;

exports.VariableDeclarator = VariableDeclarator;
