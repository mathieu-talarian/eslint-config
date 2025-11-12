import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import importX from "eslint-plugin-import-x";
import sonar from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";

export const base = defineConfig([
  globalIgnores(["dist", ".config/*"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      unicorn.configs.recommended,
      {
        rules: {
          "unicorn/prefer-global-this": 0,
        },
      },
      sonar.configs.recommended,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      {
        settings: {
          "import-x/resolver-next": [
            createTypeScriptImportResolver({
              alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
              bun: true, // resolve Bun modules https://github.com/import-js/eslint-import-resolver-typescript#bun
            }),
          ],
        },
      },
      {
        rules: {
          "no-mixed-spaces-and-tabs": 0,
          "sort-imports": [
            "error",
            {
              ignoreDeclarationSort: true,
            },
          ],
          "import-x/no-useless-path-segments": "error",
          "import-x/no-extraneous-dependencies": "error",
          "import-x/newline-after-import": "error",
          "import-x/no-duplicates": "error",
          "import-x/first": "error",
          "import-x/export": "error",
          "import-x/no-dynamic-require": "error",
          "import-x/extensions": [
            "error",
            "always",
            {
              ts: "never",
              mjs: "never",
              mts: "never",
              js: "never",
              tsx: "never",
              jsx: "never",
            },
          ],
          "import-x/order": [
            "error",
            {
              "newlines-between": "always",
              alphabetize: {
                order: "asc",
              },
              groups: [
                "type",
                "builtin",
                "external",
                "internal",
                "parent",
                "sibling",
                "index",
              ],
            },
          ],
          "arrow-body-style": ["error", "as-needed"],
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/no-var-requires": "off",
          "unicorn/prefer-module": "off",
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
          "unicorn/filename-case": "off",
          "unicorn/no-abusive-eslint-disable": "off",
          "unicorn/no-useless-undefined": "off",
          "no-nested-ternary": "off",
          "unicorn/no-null": "off",
          "unicorn/prefer-top-level-await": "off",
          "unicorn/prevent-abbreviations": "off",
        },
      },
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
