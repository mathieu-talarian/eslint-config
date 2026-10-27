import { defineConfig, Config } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";

import { TS_FILES } from "./files.js";

/**
 * Base language options for TypeScript parsing.
 * Note: Consumers should set `tsconfigRootDir` in their own config if needed.
 */
const baseLanguageOptions = {
  parser: tseslint.parser,
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

/**
 * House rules layered on top of every typescript-eslint preset below.
 * Exported for consumers that compose their own typescript-eslint config:
 * `{ files: ["**\/*.ts"], extends: [tseslint.configs.recommended], rules: tsRules }`.
 */
export const tsRules: NonNullable<Config["rules"]> = {
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
};

/** @deprecated Use `tsRules`; this alias will be removed in the next major. */
export const rules: NonNullable<Config["rules"]> = tsRules;

/**
 * Scope a set of typescript-eslint configs to `TS_FILES` so their parser and
 * rules never leak onto JavaScript or Vue files, whatever the composition order.
 */
const tsPreset = (
  presets: Config[][],
  languageOptions: Config["languageOptions"],
): Config[] =>
  defineConfig([
    {
      files: TS_FILES,
      extends: presets,
      languageOptions,
      rules: tsRules,
    },
  ]);

/**
 * Recommended TypeScript config (no type checking required).
 * Good starting point for most projects.
 */
export const recommendedTsConfig: Config[] = tsPreset(
  [tseslint.configs.recommended, tseslint.configs.stylistic],
  baseLanguageOptions,
);

/**
 * Recommended TypeScript config WITH type-checked rules.
 * Catches more bugs using TypeScript's type information.
 * Requires: projectService or project in parserOptions.
 */
export const recommendedTsConfigWithTypeCheck: Config[] = tsPreset(
  [
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
  ],
  typeCheckedLanguageOptions,
);

/**
 * Strict TypeScript config (no type checking required).
 * More opinionated rules for experienced TypeScript developers.
 */
export const strictTsConfig: Config[] = tsPreset(
  [tseslint.configs.strict, tseslint.configs.stylistic],
  baseLanguageOptions,
);

/**
 * Strict TypeScript config WITH type-checked rules.
 * Most comprehensive type-aware linting.
 * Requires: projectService or project in parserOptions.
 */
export const strictTsConfigTypeChecked: Config[] = tsPreset(
  [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
  typeCheckedLanguageOptions,
);
