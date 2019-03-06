const Identifier = ({ name }) => ({
  type: Identifier.name,
  name,
});

Identifier.isSelf = x => x.type === Identifier.name;

exports.Identifier = Identifier;
