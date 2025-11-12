import { defineConfig } from "eslint/config";
import solid from "eslint-plugin-solid";
import tsParser from "@typescript-eslint/parser";

export const solid = defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  },
]);
