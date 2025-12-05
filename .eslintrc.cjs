/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // ✅ hỗ trợ TypeScript
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier', // ✅ không xung đột với prettier
  ],
  parser: '@typescript-eslint/parser', // ✅ parser cho TS
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      alias: {
        map: [['~', require('path').resolve(__dirname, 'src')]],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: [
    '@typescript-eslint', // ✅ thêm plugin này
    'react',
    'react-hooks',
    'react-refresh',
    'prettier',
    'import',
  ],
  rules: {
    // --- TypeScript rules ---
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',

    // --- React rules ---
    'react-refresh/only-export-components': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 0,
    'react/display-name': 0,

    // --- Code style ---
    'no-undef': 'error',
    'import/no-unresolved': 'error',
    'no-console': 1,
    'no-lonely-if': 1,
    'no-unused-vars': 0, // ⚠️ vô hiệu JS rule, dùng TS rule thay
    'no-trailing-spaces': 1,
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': 1,
    'space-before-blocks': ['error', 'always'],
    'object-curly-spacing': [1, 'always'],
    indent: ['warn', 2],
    semi: [1, 'never'],
    'array-bracket-spacing': 1,
    'linebreak-style': 0,
    'no-unexpected-multiline': 'warn',
    'keyword-spacing': 1,
    'comma-dangle': 1,
    'comma-spacing': 1,
    'arrow-spacing': 1,
  },
}
