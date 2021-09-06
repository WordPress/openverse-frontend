module.exports = {
  extends: '../../.eslintrc.js',
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
  },
  rules: {
    'unicorn/filename-case': [
      'error',
      { case: 'pascalCase', ignore: ['.eslintrc.js'] },
    ],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
}
