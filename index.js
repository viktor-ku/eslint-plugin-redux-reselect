module.exports = {
  rules: {
    'assign-selector-to-variable': require('./lib/rules/assign-selector-to-variable'),
    'name-ends-with-selector': require('./lib/rules/name-ends-with-selector'),
    'no-make-select': require('./lib/rules/no-make-select'),
    'prefer-selector-ref': require('./lib/rules/prefer-selector-ref'),
  },
};
