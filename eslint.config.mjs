import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    '@rocketseat/eslint-config/react',
  ),
  ...compat.config({
    ignorePatterns: ['*.d.ts'],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      camelcase: 'off',
    },
    overrides: [
      {
        files: ['src/lib/auth/*'],
        rules: {
          '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
        },
      },
    ],
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
  }),
  ...compat.plugins('eslint-plugin-simple-import-sort'),
]

export default eslintConfig
