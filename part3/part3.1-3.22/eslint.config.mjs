import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'
import react from 'eslint-plugin-react'

export default [
  js.configs.recommended,
  {
    files: ['backend/**/*.js', 'mongo.js', 'tests/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
  },
  {
    files: ['eslint.config.mjs', 'vite.config.mjs'],
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
  },
  {
    files: ['frontend/**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      ecmaVersion: 'latest',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
    },
    rules: {
      'react/jsx-uses-vars': 'error',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
