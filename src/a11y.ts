import { defineConfig } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

import { JS_FILES, TS_FILES } from "./files.js";

export const a11y = defineConfig([
  {
    files: [...JS_FILES, ...TS_FILES],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
]);
