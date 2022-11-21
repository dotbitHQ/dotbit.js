module.exports = {
  extends: 'blockabc/typescript',
  // We should ignore these files, otherwise it will conflict with tsconfig.json and throw error when run `eslint` manually
  // https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/TROUBLESHOOTING.md#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
  ignorePatterns: [
    'lib',
    'lib.esm',
  ],
}
