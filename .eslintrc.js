module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'promise'
  ],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    'node': true,
    'jest': true
  },
  parserOptions: {
    'ecmaVersion': 11,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'quotes': [ 2, 'single' ],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 2,
    'padded-blocks': 'off',
    'indent': [2, 2],
    'no-plusplus': 'off',
    '@typescript-eslint/no-unused-vars': 2,
    'object-curly-spacing': [2, 'always'],
    'space-in-parens': [2, 'never'],
    'keyword-spacing': 2,
    'comma-spacing': 2,
    'key-spacing': 2,
    'space-infix-ops': 2,
    'arrow-spacing': 2,
    'no-console': 2,
    'new-cap': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-explicit-any': 2,
    'no-underscore-dangle': 'off',
    'semi': 2,
    '@typescript-eslint/explicit-function-return-type': 'off',
    'linebreak-style': [2, 'unix'],
    'promise/catch-or-return': 'error',
    'promise/always-return': 'off',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/no-native': 'off',
    'promise/no-nesting': 'warn',
    'promise/no-promise-in-callback': 'warn',
    'promise/no-callback-in-promise': 'warn',
    'promise/avoid-new': 'off',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'warn',
    'promise/valid-params': 'warn',
    'no-use-before-define': 'off',
    'no-continue': 'off',
    'no-else-return': 'off',
  },
  overrides: [
    {
      'files': ['*.ts', '*.tsx'],
      'rules': {
        '@typescript-eslint/explicit-function-return-type': 2,
        'promise/catch-or-return': 2,
      }
    }
  ],
  settings: {
    react: {
      version: 'detect',
    }
  }
};
  