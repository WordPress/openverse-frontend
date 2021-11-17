module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'eslint:recommended',
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'plugin:vuejs-accessibility/recommended',
    'plugin:@intlify/vue-i18n/recommended',
  ],
  // required to lint *.vue files
  plugins: ['vue', 'vuejs-accessibility', 'unicorn'],
  // add your custom rules here
  rules: {
    semi: [2, 'never'],
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-indent': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      { registeredComponentsOnly: false, ignores: ['i18n'] },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vuejs-accessibility/aria-role': 'warn',
    'vuejs-accessibility/label-has-for': [
      'warn',
      { required: { some: ['nesting', 'id'] } },
    ],
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],
  },
  settings: {
    'vue-i18n': {
      localeDir: './src/locales/*.{json}',
      messageSyntaxVersion: '^8.24.3',
    },
  },
}
