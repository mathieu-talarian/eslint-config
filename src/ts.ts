import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";

const languageOptions = {
  parser: tseslint.parser,
  parserOptions: {
    projectService: true,
    tsconfigRootDir: import.meta.dirname,
  },
  ecmaVersion: 2020,
  globals: globals.browser,
};
export const recommendedTsConfig = defineConfig([
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  { languageOptions },
]);

export const recommendedTsConfigWithTypeCheck = defineConfig([
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  { languageOptions },
]);

export const strictTsConfig = defineConfig([
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  { languageOptions },
]);
export const strictTsConfigTypeChecked = defineConfig([
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  { languageOptions },
]);
