import { base } from "./base.js";
import * as storybookConfig from "eslint-plugin-storybook";

export const storybook = [
  ...base,
  ...storybookConfig.configs["flat/recommended"],
];
