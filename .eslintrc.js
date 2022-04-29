module.exports = {
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    '@nuxtjs',
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:vue/vue3-recommended',
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: [
    'nuxt',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'space-before-function-paren': [
      'error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'comma-dangle': [
      'error', 'always-multiline',
    ],
  },
}