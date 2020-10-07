module.exports = {
  root: true,

  /*
   * tells ESLint to use the parser package you installed (@typescript-eslint/parser).
   *
   * This allows ESLint to understand TypeScript syntax.
   */
  parser: '@typescript-eslint/parser',

  plugins: [
    '@typescript-eslint',
    'import',
    'jest',
  ],

  parserOptions: {
    // Only ESLint 6.2.0 and later support ES2020.
    'ecmaVersion': 2020,
    'sourceType': 'module',
  },

  env: {
    'jest/globals': true
  },

  extends: [
    /*
     * Is ESLint's inbuilt 'recommended' config - it turns on a small, sensible set
     * of rules which lint for well-known best-practices.
     */
    'eslint:recommended',

    /*
     * Is typescript-eslint's 'recommended' config - it's just like eslint:recommended, except
     * it only turns on rules from our TypeScript-specific plugin.
     */
    'plugin:@typescript-eslint/recommended',

    /*
     * Node best practises and checks from https://www.npmjs.com/package/eslint-plugin-node
     */
    'plugin:node/recommended',

    /*
     * Make our styling consistent by using Prettier. ESlint delegates pure
     * style linting to Prettier and only does less cosmetic stuff.
     */
    'prettier',
    'prettier/@typescript-eslint',

    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',

    /*
     * Jest setup
     */
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],

  rules: {
    // eslint-plugin-node rules
    'node/exports-style': ['error', 'module.exports'],

    // Require extensions when importing code, expect for js and ts files.
    'node/file-extension-in-import': [
      'error', 'always',
      {
        tryExtensions: ['.ts', '.js'],
        '.ts': 'never',
        '.js': 'never',
      }
    ],

    'node/no-missing-import': ['error', {
      'tryExtensions': ['.ts', '.js'],
    }],


    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/console': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always'],
    'node/prefer-global/url-search-params': ['error', 'always'],
    'node/prefer-global/url': ['error', 'always'],
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error',

    // https://github.com/mysticatea/eslint-plugin-node/issues/205
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],

    // Jest specific rules
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',


    // Import rules
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never'
      }
   ],
  },
};
