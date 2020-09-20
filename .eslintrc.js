module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'class-methods-use-this': 'off',
    'no-restricted-syntax': ['error', "BinaryExpression[operator='of']"],
  },
};
