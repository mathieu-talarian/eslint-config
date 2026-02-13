import turboPlugin from "eslint-plugin-turbo";
import { Config, defineConfig } from "eslint/config";

export const turbo: Config[] = defineConfig(
  [turboPlugin.configs?.["flat/recommended"]].filter(Boolean) as any,
);
