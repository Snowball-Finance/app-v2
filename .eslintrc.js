/**
 * TODO: Warning: React version not specified in eslint-plugin-react settings. See https://github.com/yannickcr/eslint-plugin-react#configuration
 * TODO: update with the standard linting settings
 * By great.dolphin.ls
 */

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    es6: true,
  },
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', 'airbnb', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-nested-ternary': 0,
    'import/prefer-default-export': 0,
    'no-restricted-syntax': 0,
    'import/order': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'import/no-unresolved': 0,
    'react/display-name': 0, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/display-name.md
    'no-unused-vars': 'warn', // When we use var, will give us warning
    'react/no-unknown-property': 0, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
    'react/prop-types': 0, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
    'react/react-in-jsx-scope': 0, // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
    'react-hooks/rules-of-hooks': 0, // https://reactjs.org/docs/hooks-rules.html
    quotes: [2, 'single', 'avoid-escape'],
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ], // https://eslint.org/docs/rules/prefer-const
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], // Allow both file with extension .js and .jsx
    'max-len': [1, 100, 2, { ignoreComments: true }], // Allow 100 max char in a line, ignore comments
    'react/jsx-props-no-spreading': 'off', // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
  },
};
