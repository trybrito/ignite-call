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
    overrides: [
      {
        files: ['/src/lib/auth/*'],
        rules: {
          '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
        },
      },
    ],
  }),
]

export default eslintConfig
