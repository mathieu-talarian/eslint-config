import { defineConfig } from "eslint/config";

export const stylex = defineConfig([
  {
    plugins: {
      "@stylexjs": require("@stylexjs/eslint-plugin"),
    },
    rules: {
      "@stylexjs/valid-styles": "error",
      "@stylexjs/sort-keys": "warn",
    },
  },
]);
