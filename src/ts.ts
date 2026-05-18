import { defineConfig, Config } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";

/**
 * Base language options for TypeScript parsing.
 * Note: Consumers should set `tsconfigRootDir` in their own config if needed.
 */
const baseLanguageOptions = {
  parser: tseslint.parser,
  ecmaVersion: 2020,
  globals: globals.browser,
};

/**
 * Language options with type-aware linting enabled.
 * Requires a tsconfig.json in the project root.
 */
const typeCheckedLanguageOptions = {
  ...baseLanguageOptions,
  parserOptions: {
    projectService: true,
    extraFileExtensions: [".vue"],
  },
};

export const rules: Config["rules"] = {
  "@typescript-eslint/consistent-type-imports": [
    "error",
    {
      prefer: "type-imports",
    },
  ],
  "@typescript-eslint/naming-convention": [
    "error",
    {
      selector: ["interface", "typeAlias", "typeParameter"],
      format: ["PascalCase"],
      suffix: ["T"],
      filter: {
        match: false,
        regex: "^(.|ID)$",
      },
    },
  ],
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
    },
  ],
} as const;

/**
 * Recommended TypeScript config (no type checking required).
 * Good starting point for most projects.
 */
export const recommendedTsConfig = defineConfig([
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  { languageOptions: baseLanguageOptions },
]);

/**
 * Recommended TypeScript config WITH type-checked rules.
 * Catches more bugs using TypeScript's type information.
 * Requires: projectService or project in parserOptions.
 */
export const recommendedTsConfigWithTypeCheck = defineConfig([
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  { languageOptions: typeCheckedLanguageOptions },
]);

/**
 * Strict TypeScript config (no type checking required).
 * More opinionated rules for experienced TypeScript developers.
 */
export const strictTsConfig = defineConfig([
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  { languageOptions: baseLanguageOptions },
]);

/**
 * Strict TypeScript config WITH type-checked rules.
 * Most comprehensive type-aware linting.
 * Requires: projectService or project in parserOptions.
 */
export const strictTsConfigTypeChecked = defineConfig([
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  { languageOptions: typeCheckedLanguageOptions },
]);
