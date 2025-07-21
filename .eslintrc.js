module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  plugins: [
    "@typescript-eslint",
    "react-hooks",
    "simple-import-sort",
    "unused-imports",
    "import",
  ],
  extends: [
    "sanity",
    "sanity/typescript",
    "sanity/react",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  rules: {
     "@typescript-eslint/consistent-type-assertions": [
      "warn",
      {
        assertionStyle: "never",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off", // Disable React import requirement for JSX
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        ignoreRestSiblings: true,
      },
    ],
    "no-console": [
      "error",
      {
        allow: ["error"],
      },
    ],
    "import/named": 0,
    "import/no-unresolved": "off",
    "import/no-cycle": [
      2,
      {
        maxDepth: 10,
      },
    ],
    "simple-import-sort/imports": "warn",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "unused-imports/no-unused-imports": "error",
    "linebreak-style": ["warn", "unix"],
  },
  ignorePatterns: [
    ".eslintrc.js",
    "*.config.*",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["off"],
        "@typescript-eslint/consistent-type-assertions": ["off"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "react/require-default-props": ["off"],
        "import/no-cycle": ["off"],
      },
    },
  ],
}