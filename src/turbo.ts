import turboPlugin from "eslint-plugin-turbo";
import { defineConfig } from "eslint/config";

export const turbo = defineConfig([turboPlugin.configs["flat/recommended"]]);
