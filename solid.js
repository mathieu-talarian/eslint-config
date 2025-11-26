import { defineConfig } from "eslint/config";
import * as solidConfig from "eslint-plugin-solid";
import tsParser from "@typescript-eslint/parser";

export const solid = defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    ...solidConfig,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  },
]);
