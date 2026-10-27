# Eslint config

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

- Activate the repository with `activate_project`, then read `initial_instructions`.
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
- Save stable conventions or findings useful to future sessions in memory, following any
  available memory maintenance instructions.

### 3. Check relationships with Graphify

Use Graphify to understand unfamiliar repositories, relationships between modules, dependencies,
central modules, and documented decisions. Before broad searches or architectural explanations,
check whether a graph or report exists and covers the relevant files. Build or refresh the graph
if it is missing or stale.

CLI commands (check `graphify --help` before use):

- `graphify extract . --code-only --no-cluster --cargo`: locally index code and Cargo dependencies
  without model-based document extraction.
- `graphify update .`: refresh the code graph.
- `graphify query "question"`, `graphify path "A" "B"`, `graphify explain "entity"`: navigation.
- `--graph <path>` lets queries read a graph stored elsewhere; `extract --out <directory>`
  writes results to `<directory>/graphify-out/`.

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

Make targeted changes that follow existing conventions. Use Graphify for cross-module impact,
Serena for symbols, and Context7 for external APIs. Run the narrowest relevant checks first,
then broaden them according to risk; `just check` is the reference for local CI checks.
For documentation-only changes, verify facts, the diff, and formatting without running
application tests.

## Git

- Work on a branch + PR unless told to commit on main; PRs merge with merge commits.
