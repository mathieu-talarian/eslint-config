import type { Linter } from "eslint";

import * as storybookConfig from "eslint-plugin-storybook";
import { defineConfig } from "eslint/config";

export const storybook = defineConfig([
  ...storybookConfig.configs["flat/recommended"],
] as Linter.Config[]);
