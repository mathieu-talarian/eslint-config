import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";
import stylexPlugin from "@stylexjs/eslint-plugin";

/** Every rule id the plugin ships, derived from its own typings. */
type StylexRuleId = `@stylexjs/${keyof typeof stylexPlugin.rules}`;

/**
 * `satisfies` keeps this exhaustive: a rule added or renamed upstream fails
 * `tsc` until it is listed here, and a misspelled id is an excess-property error.
 */
const stylexRules = {
  // Upstream-recommended set (StyleX installation docs).
  "@stylexjs/valid-styles": "error",
  "@stylexjs/no-unused": "error",
  "@stylexjs/valid-shorthands": "warn",
  "@stylexjs/sort-keys": "warn",

  "@stylexjs/enforce-extension": "error",
  "@stylexjs/no-conflicting-props": "error",
  "@stylexjs/no-legacy-contextual-styles": "error",
  "@stylexjs/no-lookahead-selectors": "warn",
  // Repeats valid-styles' value checks with the same message, so every invalid value would be reported twice.
  "@stylexjs/no-nonstandard-styles": "off",
} satisfies Record<StylexRuleId, Linter.RuleEntry>;

export const stylex = defineConfig([
  {
    plugins: {
      // @ts-expect-error upstream `valid-shorthands` declares `meta.type: "error"`, which is not a valid ESLint RuleType
      "@stylexjs": stylexPlugin,
    },
    rules: stylexRules,
  },
]);
