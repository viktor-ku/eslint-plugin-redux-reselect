module.exports = {
  rules: {
    'assign-selector-to-variable': require('./lib/rules/assign-selector-to-variable'),
    'name-ends-with-selector': require('./lib/rules/name-ends-with-selector'),
    'prefer-selector-ref': require('./lib/rules/prefer-selector-ref'),
  },
};
