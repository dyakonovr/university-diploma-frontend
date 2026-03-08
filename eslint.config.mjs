// @ts-check
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    ignores: [
      '/logs',
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pids',
      '*.pid',
      '*.seed',
      '*.pid.lock',
      'lib-cov',
      'coverage',
      '.nyc_output',
      '.grunt',
      'bower_components',
      '.lock-wscript',
      'build/Release',
      'node_modules/',
      'jspm_packages',
      'typings',
      '.npm',
      '.eslintcache',
      '.node_repl_history',
      '*.tgz',
      '.yarn-integrity',
      '.env',
      '.cache',
      '.next',
      '.nuxt',
      'dist',
      'public',
      '.vuepress/dist',
      '.serverless',
      '.idea',
      'sw.*',
      '.DS_Store',
      '*.swp'
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'prettier/prettier': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'vue/no-unused-components': 'error',
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 1,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'never',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
          ignores: [],
        },
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        {
          registeredComponentsOnly: false,
        },
      ],
      'vue/no-irregular-whitespace': [
        'error',
        {
          skipStrings: true,
          skipComments: false,
          skipRegExps: false,
          skipTemplates: false,
          skipHTMLAttributeValues: false,
          skipHTMLTextContents: false,
        },
      ],
      'vue/no-dupe-keys': [
        'error',
        {
          groups: [],
        },
      ],
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'vue/block-order': ['error', {
        'order': [ 'template', 'script', 'style' ]
      }],
      'vue/no-multiple-template-root': 'off',

      /* === СОРТИРОВКА ИМПОРТОВ === */
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      /* отключаем стандартную сортировку, чтобы не конфликтовала */
      'sort-imports': 'off',
      '@typescript-eslint/unified-signatures': 'off',
    },
  }  
);