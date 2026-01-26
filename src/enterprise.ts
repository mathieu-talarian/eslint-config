import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";

/**
 * Enterprise-grade TypeScript ESLint configuration.
 *
 * This configuration is designed for production codebases with strict
 * type safety requirements. It includes:
 * - All strict type-checked rules from typescript-eslint
 * - Critical promise/async safety rules
 * - Explicit typing requirements
 * - Security-focused rules
 *
 * Requires: TypeScript project with tsconfig.json
 */
export const enterprise = defineConfig([
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // ============================================
      // PROMISE & ASYNC SAFETY (Critical)
      // ============================================

      // Disallow floating promises - prevents unhandled rejections
      "@typescript-eslint/no-floating-promises": [
        "error",
        {
          ignoreVoid: true, // Allow explicit void operator
          ignoreIIFE: false,
        },
      ],

      // Disallow awaiting non-Thenable values
      "@typescript-eslint/await-thenable": "error",

      // Disallow Promises in places not designed to handle them
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksConditionals: true,
          checksVoidReturn: true,
          checksSpreads: true,
        },
      ],

      // Require async functions to have await
      "@typescript-eslint/require-await": "error",

      // Require Promise-returning functions to be async
      "@typescript-eslint/promise-function-async": [
        "error",
        {
          allowedPromiseNames: ["Thenable"],
          checkArrowFunctions: true,
          checkFunctionDeclarations: true,
          checkFunctionExpressions: true,
          checkMethodDeclarations: true,
        },
      ],

      // Enforce consistent return await behavior in try/catch
      "@typescript-eslint/return-await": ["error", "in-try-catch"],

      // ============================================
      // TYPE SAFETY (High Priority)
      // ============================================

      // Require explicit return types on functions/methods
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        },
      ],

      // Require explicit accessibility modifiers on class properties/methods
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit",
          overrides: {
            constructors: "no-public",
          },
        },
      ],

      // Require strict boolean expressions (no truthy/falsy)
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true,
          allowNullableBoolean: false,
          allowNullableString: false,
          allowNullableNumber: false,
          allowAny: false,
        },
      ],

      // Prevent unnecessary conditionals (dead code detection)
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],

      // Disallow explicit any - warn instead of error for migration
      "@typescript-eslint/no-explicit-any": "warn",

      // ============================================
      // UNSAFE ANY OPERATIONS (Security)
      // ============================================

      // These rules catch unsafe operations with `any` typed values
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",

      // ============================================
      // CODE QUALITY
      // ============================================

      // Prefer readonly for properties that are never reassigned
      "@typescript-eslint/prefer-readonly": "error",

      // Require using includes() over indexOf() !== -1
      "@typescript-eslint/prefer-includes": "error",

      // Require string startsWith/endsWith over regex/indexOf
      "@typescript-eslint/prefer-string-starts-ends-with": "error",

      // Require Array.isArray() instead of instanceof Array
      "@typescript-eslint/no-array-constructor": "error",

      // Disallow void expressions in misleading positions
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        {
          ignoreArrowShorthand: true,
          ignoreVoidOperator: true,
        },
      ],

      // Require throwing Error objects only
      "@typescript-eslint/only-throw-error": "error",

      // Disallow unnecessary type assertions
      "@typescript-eslint/no-unnecessary-type-assertion": "error",

      // Prefer nullish coalescing over logical OR for defaults
      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        {
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
        },
      ],

      // Prefer optional chaining over && chains
      "@typescript-eslint/prefer-optional-chain": "error",

      // ============================================
      // CONSISTENCY
      // ============================================

      // Enforce consistent type imports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: true,
          fixStyle: "separate-type-imports",
        },
      ],

      // Enforce consistent type exports
      "@typescript-eslint/consistent-type-exports": [
        "error",
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],

      // Enforce consistent type assertion style
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        {
          assertionStyle: "as",
          objectLiteralTypeAssertions: "allow-as-parameter",
        },
      ],

      // ============================================
      // NAMING CONVENTIONS
      // ============================================
      "@typescript-eslint/naming-convention": [
        "error",
        // Default: camelCase
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        // Variables: camelCase or UPPER_CASE (for constants)
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        // Effect TS: Layer implementations use PascalCase with Live/Test suffix (e.g., ConfigLive, LoggerLive)
        {
          selector: "variable",
          format: ["PascalCase"],
          filter: {
            match: true,
            regex: "(Live|Test|Layer)$",
          },
        },
        // Functions: camelCase or PascalCase (for React components)
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: ["typeLike", "interface", "typeAlias", "typeParameter"],
          format: ["PascalCase"],
          suffix: ["T"],
          filter: {
            match: false,
            regex: "^(.|ID)$",
          },
        },
        // Enum members: PascalCase or UPPER_CASE
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
        // Allow any format for properties (APIs often use various formats)
        {
          selector: "property",
          format: null,
        },
        // Import default: camelCase or PascalCase
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
      ],

      // ============================================
      // DISABLED BASE ESLINT RULES
      // (Handled by TypeScript equivalents above)
      // ============================================
      "no-unused-vars": "off",
      "require-await": "off",
      "no-return-await": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
]);

/**
 * Enterprise config with relaxed explicit-any for gradual migration.
 * Use this when migrating existing projects to stricter typing.
 */
export const enterpriseRelaxed = defineConfig([
  ...enterprise,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
    },
  },
]);
