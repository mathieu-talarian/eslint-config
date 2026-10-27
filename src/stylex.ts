import { defineConfig } from "eslint/config";
import stylexPlugin from "@stylexjs/eslint-plugin";

export const stylex = defineConfig([
  {
    plugins: {
      // @ts-expect-error upstream `valid-shorthands` declares `meta.type: "error"`, which is not a valid ESLint RuleType
      "@stylexjs": stylexPlugin,
    },
    rules: {
      "@stylexjs/valid-styles": "error",
      "@stylexjs/sort-keys": "warn",
    },
  },
]);
