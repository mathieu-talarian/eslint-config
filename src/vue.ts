import {
  configureVueProject,
  defineConfigWithVueTs,
  vueTsConfigs,
  withVueTs,
} from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";

// Building blocks, re-exported for consumers that need custom composition.
export { vueTsConfigs, withVueTs };

type VueTsOptionsT = Parameters<typeof configureVueProject>[0];
type VueTsConfigsT = Parameters<typeof defineConfigWithVueTs>;

/**
 * Official Vue + TypeScript type-checked wiring (strict + stylistic).
 *
 * Wraps @vue/eslint-config-typescript's `withVueTs`, which owns the
 * vue-eslint-parser/typescript-eslint layering, projectService and
 * extraFileExtensions consistency, and loosens no-unsafe-* rules only on
 * Vue component operations (allowComponentTypeUnsafety, default true).
 *
 * IMPORTANT: pass ALL your configs through this helper (it must compose the
 * final config) — do not spread its result next to sibling TS configs.
 *
 * @example
 * // eslint.config.mjs
 * export default vueTs(
 *   { rootDir: import.meta.dirname },
 *   base,
 *   a11y,
 *   { rules },
 * );
 */
export const vueTs = (options: VueTsOptionsT, ...configs: VueTsConfigsT) =>
  withVueTs(
    options ?? {},
    pluginVue.configs["flat/recommended"],
    vueTsConfigs.strictTypeChecked,
    vueTsConfigs.stylisticTypeChecked,
    ...configs,
  );
