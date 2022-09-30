const path = require('path');
const resolve = (_path) => path.resolve(__dirname, _path);

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser', // 配置ts解析器
  parserOptions: {
    project: resolve('./tsconfig.json'),
    tsconfigRootDir: resolve('./'),
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  ignorePatterns: ['.eslintrc.js', 'rollup.config.js'],
  // plugins: ['prettier'],
  rules: {
    indent: ['error', 2, {SwitchCase: 1}],
    // 'no-unused-vars': 'error',
    'no-console': 'off',
    // 单引号
    quotes: ['error', 'single'],
    'no-plusplus': 'off',
    // @fixable 结尾必须有分号
    semi: [
      'error',
      'always',
      {
        omitLastInOneLineBlock: true,
      },
    ],
    // 对象字面量中冒号的前后空格
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    // 关键字前后使用一致的空格
    'keyword-spacing': [
      'error',
      {
        before: true,
      },
    ],
    // 箭头函数前后空格
    'arrow-spacing': 'error',
  },
};
