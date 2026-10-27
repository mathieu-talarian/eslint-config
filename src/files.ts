/**
 * Shared file globs. Internal: not re-exported from `index.ts`.
 *
 * `TS_FILES` deliberately excludes `.vue` so that no TypeScript preset
 * assigns `@typescript-eslint/parser` to Vue SFCs; `vue-eslint-parser`
 * must own those regardless of how consumers order their configs.
 */
export const JS_FILES = ["**/*.{js,mjs,cjs,jsx}"];
export const TS_FILES = ["**/*.{ts,tsx,mts,cts}"];
export const SOURCE_FILES = [...JS_FILES, ...TS_FILES, "**/*.vue"];
