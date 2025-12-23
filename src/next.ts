import { defineConfig } from "eslint/config";
import pluginNext from "@next/eslint-plugin-next";

export const next = defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
]);
