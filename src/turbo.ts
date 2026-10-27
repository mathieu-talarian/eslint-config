import turboPlugin from "eslint-plugin-turbo";
import { Config, defineConfig } from "eslint/config";

// `ESLint.Plugin` types `configs` as optional and legacy-compatible; the flat
// preset is always present at runtime.
export const turbo = defineConfig([
  turboPlugin.configs?.["flat/recommended"] as Config,
]);
