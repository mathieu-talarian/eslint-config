import { defineConfig, Config } from "eslint/config";
import eslintReact from "@eslint-react/eslint-plugin";
import reactRefresh from "eslint-plugin-react-refresh";
import reactHooks from "eslint-plugin-react-hooks";
import importX from "eslint-plugin-import-x";

export const react = defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintReact.configs["recommended-typescript"],
      importX.flatConfigs.react as unknown as Config,
    ],
  },
]);
