#!/usr/bin/env node
/**
 * Consumer smoke test.
 *
 * Packs the current tree, installs the tarball with npm (whose flat hoisting
 * differs from Yarn's and has broken plugin loading before), then lints
 * fixtures with every exported preset. A run fails on any ESLint crash or
 * fatal parsing error, which guards config loading, parser ownership of
 * `.js` / `.vue` files and `extends` composition.
 */
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const keepWorkDir = process.argv.includes("--keep");

const exec = (command, args, cwd) => {
  try {
    const stdout = execFileSync(command, args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    return {
      status: error.status ?? 1,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? String(error),
    };
  }
};

const fixtures = {
  "src/a.ts": [
    "export interface Foo {",
    "  x: number;",
    "}",
    "export const f = async (a: any) => {",
    "  const p = Promise.resolve(a);",
    "  p;",
    "  return a?.x || 1;",
    "};",
    "",
  ].join("\n"),
  "src/b.tsx": [
    'import { useEffect, useState } from "react";',
    "export function C() {",
    "  const [s, setS] = useState(0);",
    "  useEffect(() => {",
    "    setS(1);",
    "  });",
    "  return <div onClick={() => s}>{s}</div>;",
    "}",
    "",
  ].join("\n"),
  "src/c.js": "export const y = 1;\n",
  "src/d.vue": [
    '<script setup lang="ts">',
    "const n: number = 1;",
    "</script>",
    "<template><div>{{ n }}</div></template>",
    "",
  ].join("\n"),
  "tsconfig.json": JSON.stringify(
    {
      compilerOptions: {
        strict: true,
        module: "nodenext",
        moduleResolution: "nodenext",
        target: "es2022",
        jsx: "react-jsx",
        allowJs: true,
        noEmit: true,
      },
      include: ["src"],
    },
    null,
    2,
  ),
};

const work = mkdtempSync(join(tmpdir(), "eslint-config-smoke-"));
console.log(`work dir: ${work}`);

const packed = JSON.parse(
  exec("npm", ["pack", "--pack-destination", work, "--json"], root).stdout,
);
const tarball = join(work, packed[0].filename);

writeFileSync(
  join(work, "package.json"),
  JSON.stringify(
    {
      name: "eslint-config-smoke",
      private: true,
      type: "module",
      dependencies: {
        [pkg.name]: `file:${tarball}`,
        eslint: pkg.devDependencies.eslint,
        typescript: pkg.devDependencies.typescript,
      },
    },
    null,
    2,
  ),
);
mkdirSync(join(work, "src"));
for (const [file, content] of Object.entries(fixtures)) {
  writeFileSync(join(work, file), content);
}

const install = exec(
  "npm",
  ["install", "--no-audit", "--no-fund", "--loglevel=error"],
  work,
);
if (install.status !== 0) {
  console.error(install.stderr);
  process.exit(1);
}

const presets = await import(
  pathToFileURL(join(work, "node_modules", pkg.name, "dist", "index.js")).href
);
const presetNames = Object.entries(presets)
  .filter(([, value]) => Array.isArray(value))
  .map(([name]) => name);

const scenarios = [
  // Every preset composed with the TS parser preset so `.ts`/`.tsx` parse;
  // most presets carry no parser of their own.
  ...presetNames.map((name) => {
    const imports = [...new Set([name, "recommendedTsConfig"])].join(", ");
    const spread =
      name === "recommendedTsConfig" ? name : `recommendedTsConfig, ...${name}`;
    return {
      name: `${name} (+ recommendedTsConfig)`,
      config: `import { ${imports} } from "${pkg.name}";\nexport default [...${spread}];\n`,
      files: ["src/a.ts", "src/b.tsx"],
    };
  }),
  {
    name: "base alone lints .js",
    config: `import { base } from "${pkg.name}";\nexport default [...base];\n`,
    files: ["src/c.js"],
  },
  {
    name: "enterprise does not parse .js with the TS parser",
    config: `import { base, enterprise } from "${pkg.name}";\nexport default [...base, ...enterprise];\n`,
    files: ["src/c.js", "src/a.ts"],
  },
  {
    name: "vueTs keeps vue-eslint-parser next to the TS presets",
    config: `import { vueTs, base, recommendedTsConfig, strictTsConfigTypeChecked, enterprise } from "${pkg.name}";\nexport default vueTs({ rootDir: import.meta.dirname }, base, recommendedTsConfig, strictTsConfigTypeChecked, enterprise);\n`,
    files: ["src/d.vue", "src/a.ts"],
  },
];

let failures = 0;
for (const scenario of scenarios) {
  writeFileSync(join(work, "eslint.config.mjs"), scenario.config);
  const result = exec(
    join(work, "node_modules", ".bin", "eslint"),
    ["--format", "json", ...scenario.files],
    work,
  );
  const problems = [];
  if (result.status > 1) {
    problems.push(
      result.stderr.trim().split("\n").slice(0, 3).join(" | ") ||
        `eslint exited with ${result.status}`,
    );
  } else {
    let report = [];
    try {
      report = JSON.parse(result.stdout);
    } catch {
      problems.push(
        `unparseable eslint output: ${result.stdout.slice(0, 200)}`,
      );
    }
    for (const file of report) {
      for (const message of file.messages) {
        if (message.fatal || message.ruleId === null) {
          problems.push(
            `${file.filePath.split("/").pop()}: ${message.message}`,
          );
        }
      }
    }
  }
  const status = problems.length === 0 ? "ok  " : "FAIL";
  console.log(`${status} ${scenario.name}`);
  for (const problem of problems) {
    console.log(`       ${problem}`);
  }
  failures += problems.length === 0 ? 0 : 1;
}

if (!keepWorkDir) {
  rmSync(work, { recursive: true, force: true });
}
console.log(
  `\n${scenarios.length - failures}/${scenarios.length} scenarios passed`,
);
process.exit(failures === 0 ? 0 : 1);
