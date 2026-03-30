import { defineConfig } from "eslint/config";
import * as solidConfig from "eslint-plugin-solid";
import pluginRouter from "@tanstack/eslint-plugin-router";

export const solid = defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // @ts-expect-error types
      solidConfig.default.configs["flat/typescript"],
    ],
  },
]);

export const tanstackRouter = defineConfig([
  pluginRouter.configs["flat/recommended"],
]);
