import type { Linter } from "eslint";

import * as storybookConfig from "eslint-plugin-storybook";

export const storybook = [
  ...storybookConfig.configs["flat/recommended"],
] as Linter.Config[];
