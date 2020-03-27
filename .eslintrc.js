module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': ["error", { "code": 300 }],
    'no-underscore-dangle': 'off',
    "linebreak-style": 0
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
