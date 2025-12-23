import { defineConfig } from "eslint/config";
import stylexPlufin from "@stylexjs/eslint-plugin";

export const stylex = defineConfig([
  {
    plugins: {
      // @ts-ignore
      "@stylexjs": stylexPlufin,
    },
    rules: {
      "@stylexjs/valid-styles": "error",
      "@stylexjs/sort-keys": "warn",
    },
  },
]);
