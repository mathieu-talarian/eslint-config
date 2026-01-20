import { Config, defineConfig } from "eslint/config";
import noBarrelFilesConfig from "eslint-plugin-no-barrel-files";

export const noBarrelFiles = defineConfig([
  noBarrelFilesConfig.flat as unknown as Config,
]);
