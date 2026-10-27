import { defineConfig, Config } from "eslint/config";
import eslintReact from "@eslint-react/eslint-plugin";
import reactRefresh from "eslint-plugin-react-refresh";
import reactHooks from "eslint-plugin-react-hooks";
import importX from "eslint-plugin-import-x";

const hooksRecommended = reactHooks.configs.flat.recommended;
const reactX = eslintReact.configs["recommended-typescript"];
const reactXRuleNames = new Set(
  Object.keys(eslintReact.rules ?? {}).map((name) => `@eslint-react/${name}`),
);

/**
 * `@eslint-react` ports several `eslint-plugin-react-hooks` rules verbatim
 * (exhaustive-deps, set-state-in-effect, ...). The official plugin, which also
 * ships the React Compiler diagnostics, stays authoritative; its duplicates in
 * `@eslint-react` are switched off so each problem is reported once.
 */
const duplicatedReactXRules: NonNullable<Config["rules"]> = Object.fromEntries(
  Object.keys(hooksRecommended.rules ?? {})
    .map((rule) => `@eslint-react/${rule.replace(/^react-hooks\//, "")}`)
    .filter((rule) => reactXRuleNames.has(rule))
    .map((rule) => [rule, "off"]),
);

export const react = defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      hooksRecommended,
      reactRefresh.configs.vite,
      reactX,
      importX.flatConfigs.react as unknown as Config,
    ],
    rules: duplicatedReactXRules,
  },
]);
