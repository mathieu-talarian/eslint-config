import { defineConfig } from "eslint/config";
import * as solidConfig from "eslint-plugin-solid";
import tsParser from "@typescript-eslint/parser";

export const solid = defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // @ts-expect-error types
      solidConfig.default.configs["flat/typescript"],
      {
        languageOptions: {
          parser: tsParser,
          parserOptions: {
            project: "tsconfig.json",
          },
        },
      },
    ],
  },
]);
