# ESLint config

## Repository context

- `@mathieu-talarian/eslint-config` provides shared ESLint flat configurations.
  TypeScript sources use ESM; `src/index.ts` is the public re-export surface.
- `src/base.ts` defines the base configuration, `src/ts.ts` defines TypeScript
  variants, and the other `src/*.ts` files define framework or focused presets.
- `package.json` is the source of truth for versions and scripts. Use its pinned
  Node version (Volta) and Yarn version (`packageManager`); `.yarnrc.yml` points
  to the committed Yarn release. Preserve exact dependency pins.
- `yarn build` runs SWC for JavaScript and `tsc` for declarations. `.swcrc` and
  `tsconfig.json` control these outputs. `dist/` is generated and ignored by Git;
  edit `src/`, not build artifacts.

## Required tool contract

**Graphify, Serena, Sequential Thinking, and Context7 are required.** This file describes
how to use them; it does not install or connect them.

- Check their availability at the start of every task, including text edits.
- Use all four for every non-trivial task: planning, debugging, architecture, dependency or API
  work, refactoring, multi-file edits, migrations, or unfamiliar code. For trivial tasks,
  use the relevant tools.
- Prefer MCP or native integrations. An installed CLI or slash command is acceptable when no
  MCP tool is available. Inspect exposed tools and the installed version's help; do not assume
  a tool name or option exists.
- Never claim to have used a tool without actually calling it.
- If a required tool is missing, disconnected, denied, or failing, **stop before editing**.
  Identify the tool, its intended use, and the configuration or permission needed (or the
  missing diagnostic information). Ask whether Mr. Twinkle wants to continue without it;
  wait for the answer before making further edits.

## Workflow

### 1. Plan with Sequential Thinking

Call the tool at the start of every non-trivial task to define the steps and validation.
Revise or branch the plan when assumptions change. Make a final verification call before
responding. Share conclusions and next actions, never private reasoning.

### 2. Load context with Serena

- Read `initial_instructions` first, then activate this repository with
  `activate_project`. If activation requires a session ID, use the one returned
  by the instructions; do not hardcode it.
- Check onboarding status using the available tools and information; call `onboarding` only
  if it has not already been completed. Read relevant memories.
- Before reading a large source file or editing a symbol-heavy file, obtain its symbol overview
  or locate the relevant symbol. Inspect references or implementations to assess impact;
  prefer semantic edits and refactorings.
- Use the tool names actually exposed: depending on the backend, `get_symbols_overview`,
  `find_symbol`, and `find_referencing_symbols`, or their `jet_brains_*` variants. Validate
  with the available diagnostics or inspections, followed by repository checks.
- For files without symbols, targeted text reads and edits are appropriate.
  Avoid repeated raw searches when semantic tools can answer the question.
- Follow `memory_maintenance` when available and use `core` as the memory entry
  point when it exists. Save only stable, non-obvious findings; avoid duplicating
  easily read metadata or recording task progress in memory.

### 3. Check relationships with Graphify

Use Graphify to understand unfamiliar repositories, relationships between modules, dependencies,
central modules, and documented decisions. Before broad searches or architectural explanations,
check whether a graph or report exists and covers the relevant files. Build or refresh the graph
if it is missing or stale.

CLI examples (verify support with the installed `graphify --help` before use):

- `graphify extract . --code-only --no-cluster`: index code locally without
  model-based document extraction. This repository uses Yarn, not Cargo; check
  package relationships against `package.json` and `yarn.lock`.
- `graphify update .`: refresh the code graph.
- `graphify query "question"`, `graphify path "A" "B"`, `graphify explain "entity"`: navigation.
- `--graph <path>` lets queries read a graph stored elsewhere; `extract --out <directory>`
  writes results to `<directory>/graphify-out/`.

Keep temporary graph artifacts outside the repository unless they are already
tracked or explicitly requested. For example, add `--out <temporary-directory>`
to extraction and pass that graph's path to subsequent queries. Check graph
coverage before relying on it; a code graph does not establish documentation facts.

Distinguish the `/graphify` slash command from CLI syntax. A `--code-only` extraction does not
cover documents, PDFs, or images; also report files skipped because an extractor is missing.
Validate conclusions against source files: they take precedence over the graph, which must be
updated when they disagree. Install hooks (`graphify hook install`) only when Mr. Twinkle requests
that automation.

### 4. Consult Context7 for dependencies

Before writing or modifying code that uses a library, framework, API, SDK, build tool,
configuration format, or test framework, check the version used by the repository.
Resolve the ID with `resolve-library-id` (sometimes exposed as `resolve_library_id`), then
call `query-docs` / `query_docs` with a focused question and that ID. Use documentation for
the pinned version when available, and cite the library ID when the answer depends on it.
If relevant documentation is missing, say so and consult official documentation or source files;
distinguish this from an inaccessible or failing tool.

### 5. Implement and verify

Make targeted changes that follow existing conventions. Use Graphify for
cross-module impact, Serena for symbols, and Context7 for external APIs.

- Keep `.js` extensions in relative TypeScript imports and re-exports for ESM
  output. Export new public presets from `src/index.ts`.
- Preserve config composition order, file globs, plugin namespaces, and rule
  severity unless changing them is part of the task. Later matching flat config
  entries can override earlier settings; review consumer impact.
- Preserve parser ownership: `src/ts.ts` excludes `.vue` from its TypeScript
  parser scope so it does not override `vue-eslint-parser` during composition.
- For dependency changes, update `package.json` and `yarn.lock` together using
  the pinned Yarn version. Check plugin compatibility with the installed ESLint
  and TypeScript versions rather than assuming the latest versions interoperate.

Run the narrowest relevant checks first, then broaden according to risk:

| Change                                  | Validation                                                                                                                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dependency installation or lockfile     | `yarn install --immutable` validates the committed lockfile without regenerating it.                                                                                                       |
| Source, presets, or build configuration | Run relevant targeted checks, then `yarn build` for JavaScript and declaration generation.                                                                                                 |
| Preset behavior                         | Exercise the affected preset with representative consumer files/configuration when practical; compilation alone does not validate rule behavior.                                           |
| Documentation only                      | Verify facts and referenced paths, run `yarn exec prettier --check AGENTS.md` when editing this file, and inspect `git diff --check` and the final diff. No application build is required. |

There is currently no justfile, test script, or lint script. Do not assume
`just check`, `yarn test`, or `yarn lint` exists; recheck `package.json` and repository
files if tooling changes. Report the checks actually run and any validation gaps.

`.github/workflows/publish.yml` publishes to GitHub Packages on `v*` tags after
an immutable Yarn install. Publishing invokes `prepublishOnly`, which builds the
package. Release scripts change versions, push tags, or publish packages; use them
only when a release is requested, never as validation.

## Git

- Work on a branch + PR unless told to commit on main; PRs merge with merge commits.
- Check the working tree before editing and preserve unrelated local changes.
  Keep commits scoped to the task; leave generated output and local tool state out.
- Include the concrete behavior change and validation in the PR description.
  Do not merge or trigger a release unless requested.
