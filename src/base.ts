import js from "@eslint/js";
import { Config, defineConfig, globalIgnores } from "eslint/config";
import importX from "eslint-plugin-import-x";
import sonar from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";

export const base = defineConfig([
  globalIgnores(["dist", ".config/*"]),
  {
    files: ["**/*.{ts,tsx}"],
    // @ts-expect-error types
    extends: [
      js.configs.recommended,
      unicorn.configs.recommended,
      sonar.configs.recommended,
      importX.flatConfigs.recommended as unknown as Config,
      importX.flatConfigs.typescript as unknown as Config,
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
          "unicorn/prefer-module": "off",
          "no-unused-vars": "off",
          "sonarjs/no-unused-vars": "off",
          "unicorn/filename-case": "off",
          "unicorn/no-abusive-eslint-disable": "off",
          "unicorn/no-useless-undefined": "off",
          "no-nested-ternary": "off",
          "unicorn/no-null": "off",
          "unicorn/prefer-top-level-await": "off",
          "unicorn/prevent-abbreviations": "off",
          "max-lines": ["error", 250],
        },
      },
    ].filter(Boolean),
  },
]);
