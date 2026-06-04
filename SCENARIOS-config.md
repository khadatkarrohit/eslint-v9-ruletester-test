# Scenarios — @eslint/v9-to-v10-config

All scenarios validated against files in `config-tests/`.

---

## Transform 1 — Remove `eslint-env` inline comments

Script: `remove-eslint-env-comments.ts`
File: `config-tests/eslint-env-comments.js`

ESLint v10 throws a lint error when `/* eslint-env ... */` comments are encountered.

| # | Scenario | Result |
|---|----------|--------|
| 1 | Comment on its own line — whole line removed | PASS |
| 2 | Multiple envs in one comment (`node, browser`) | PASS |
| 3 | Extra whitespace inside comment (`/*  eslint-env   browser  */`) | PASS |
| 4 | Comment inline with code — only comment removed, code preserved | PASS |
| 5 | Two consecutive comments on different lines — both removed | PASS |
| 6 | Comment at end of file | PASS |
| 7 | Blank lines that were already empty — preserved (not dropped) | PASS |
| 8 | Regular `//` and `/* */` non-eslint-env comments — not touched | PASS |

---

## Transform 2 — Remove legacy env vars and CLI flags

Script: `remove-legacy-flags.ts`
Files: `config-tests/legacy-flags-env-vars.js`, `config-tests/legacy-flags-cli.js`, `config-tests/edge-cases-real-world.js`

### ESLINT_USE_FLAT_CONFIG

| # | Scenario | Result |
|---|----------|--------|
| 1 | `ESLINT_USE_FLAT_CONFIG=true eslint .` | PASS |
| 2 | `ESLINT_USE_FLAT_CONFIG=false eslint .` | PASS |
| 3 | `export ESLINT_USE_FLAT_CONFIG=true && eslint .` — `&&` not left dangling | PASS |
| 4 | `export ESLINT_USE_FLAT_CONFIG=true && make lint` — full command preserved | PASS |
| 5 | With additional valid flags after (`--fix --max-warnings 0` preserved) | PASS |
| 6 | Inside a longer pipeline (`| tee lint.log` preserved) | PASS |
| 7 | Inside template literal (`.env`-file style) | PASS |
| 8 | `cross-env ESLINT_USE_FLAT_CONFIG=false eslint .` — env var removed, `cross-env` preserved | PASS |
| 9 | `MY_ESLINT_USE_FLAT_CONFIG=true` — partial name NOT touched (word boundary fix) | PASS |
| 10 | `DISABLE_ESLINT_USE_FLAT_CONFIG=false` — partial name NOT touched | PASS |
| 11 | Unrelated env vars (`NODE_ENV`, `CI`) — not touched | PASS |

### ESLINT_FLAGS values

| # | Scenario | Result |
|---|----------|--------|
| 12 | `ESLINT_FLAGS=v10_config_lookup_from_file` — value removed | PASS |
| 13 | `ESLINT_FLAGS=unstable_config_lookup_from_file` (v9.x alias) — removed | PASS |
| 14 | `ESLINT_FLAGS=unstable_ts_config` (v9.x alias) — removed | PASS |
| 15 | Flag at start of comma list: `v10_config_lookup_from_file,other` → `other` | PASS |
| 16 | Flag at end of comma list: `other,v10_config_lookup_from_file` → `other` | PASS |
| 17 | Flag in middle: `flag-a,v10_config_lookup_from_file,flag-b` → `flag-a,flag-b` | PASS |

### Removed CLI flags

| # | Scenario | Result |
|---|----------|--------|
| 18 | `--no-eslintrc` alone — removed, `src/` NOT consumed as value | PASS |
| 19 | `--no-eslintrc` followed by another flag (`--fix` preserved) | PASS |
| 20 | `--env browser` (single value) | PASS |
| 21 | `--env browser,node` (comma-separated values) | PASS |
| 22 | `--env browser --env node` (separate flags) — both removed | PASS |
| 23 | `--env` at end of command with no value | PASS |
| 24 | `--rulesdir ./custom-rules` (path value) | PASS |
| 25 | `--ignore-path .gitignore` (file value) | PASS |
| 26 | `--resolve-plugins-relative-to .` (dot value) | PASS |
| 27 | Multiple removed flags in one command | PASS |
| 28 | Removed flags mixed with valid flags (`--fix`, `--max-warnings`, `--ext`) — valid flags survive | PASS |
| 29 | `--no-eslintrc` at end of command (no trailing path) | PASS |
| 30 | Valid-flags-only command — not touched | PASS |

---

## Known limitations (by design, not bugs)

| # | Pattern | Behaviour |
|---|---------|-----------|
| L1 | `cross-env ESLINT_USE_FLAT_CONFIG=true eslint .` → `cross-env eslint .` | `cross-env` prefix preserved — removing it would require knowing no other env vars remain. Harmless no-op. |
| L2 | `ESLINT_FLAGS=v10_config_lookup_from_file` → `ESLINT_FLAGS=` (empty) | Safe — empty `ESLINT_FLAGS=` is a no-op in shell. Full assignment removal would require knowing the var isn't used elsewhere. |
| L3 | `ESLINT_USE_FLAT_CONFIG: 'false'` in JS object literal (`env: { ... }`) | Not transformed — colon syntax is JS, not shell. Requires manual fix. Seen in projen, NX. |
| L4 | `process.env.ESLINT_USE_FLAT_CONFIG = 'true'` (dotted JS assignment) | Not transformed — JS assignment, not shell. Requires manual fix. Seen in microsoft/just. |
| L5 | `process.env['ESLINT_USE_FLAT_CONFIG'] = 'true'` (bracket notation) | Not transformed — same as L4. |
| L6 | `ESLINT_USE_FLAT_CONFIG: "true"` in YAML `env:` block (GitHub Actions) | Not transformed — YAML colon syntax differs from shell `=`. Requires manual fix. |
| L7 | Flag names appearing in `//` comments also stripped | Expected trade-off of raw-text transform. Cosmetic only. |

---

**Total: 30 scenarios — 30 PASS, 7 known limitations documented**

---

## Bugs found and fixed during testing

| Bug | Root cause | Fix |
|-----|-----------|-----|
| `--no-eslintrc src/'` consumed closing quote | `[^\s]*` was too greedy inside string literals | Separated boolean flags from value flags; value token stops at quote chars |
| `export ESLINT_USE_FLAT_CONFIG=true && eslint .` → `&& eslint .` | `&&` not consumed by regex | Added `(?:&&\s*)?` to the env var removal regex |
| `MY_ESLINT_USE_FLAT_CONFIG=true` → `MY_` (partial match) | Missing word boundary | Added `\b` before env var name in regex |
