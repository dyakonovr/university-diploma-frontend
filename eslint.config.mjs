// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
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
      'import/extensions': 'off'
    },
  }  
);
