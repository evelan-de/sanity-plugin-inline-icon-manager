// CommonJS-compatible config to avoid ESM import issues during build
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('@sanity/pkg-utils')

module.exports = defineConfig({
  dist: 'dist',
  tsconfig: 'tsconfig.dist.json',

  // Remove this block to enable strict export validation
  extract: {
    rules: {
      // 'ae-forgotten-export': 'off',
      'ae-incompatible-release-tags': 'off',
      'ae-internal-missing-underscore': 'off',
      'ae-missing-release-tag': 'off',
    },
  },
})
