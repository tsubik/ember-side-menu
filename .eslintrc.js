module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: ['prettier'],
  plugins: ['ember', 'prettier'],
  extends: ['eslint:recommended', 'plugin:ember/recommended'],
  env: {
    browser: true,
    node: true
  },
  rules: {
    'prettier/prettier': 'error'
  }
};
