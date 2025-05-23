/* eslint-disable */
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
   baseDirectory: __dirname,
})

const eslintConfig = [
   ...compat.extends('next/core-web-vitals', 'next/typescript'),

   {
      rules: {
         'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
         // 'comma-dangle': [
         //    'warn',
         //    {
         //       arrays: 'always',
         //       objects: 'always',
         //       imports: 'never',
         //       exports: 'never',
         //       functions: 'never',
         //    },
         // ], // trailingComma: "all",
         // indent: ['error', 3], // tabWidth: 3
         semi: ['error', 'never'], // semi: false
         quotes: ['error', 'single'], // singleQuote: true
         'arrow-parens': ['error', 'as-needed'], // arrowParens: "avoid"
      },
   },
   {
      ignores: ['src/generated/**'], // Ignore generated files
   },
]

export default eslintConfig
