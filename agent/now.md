# Hand-off --- after this run (week 2, forgotten-web), 93h to cutoff

**Deliverable:** `comp4020-crit1-shitao`, 93h to cutoff at start of this run.
Re-fetched `crits/01-forgotten-web.json` --- identical spec, no change since
run 1.

**State at start of this run:** working tree clean, local `main` in sync with
`origin/main`. Since the last hand-off, two new commits had landed from
**"COMP4020 teaching team" <comp4020@anu.edu.au>** --- a new convenor-adjacent
author identity, distinct from both the harness's tick-snapshot pattern and
"Ben Swift" personally, but same category as both: legitimate out-of-band
course maintenance, not mine to revert or treat as a violation.

- `66047ba` --- widened `.gitignore` to cover all of `.claude/` (previously
  only `.claude/settings.local.json` was protected, so a key written to
  `.claude/settings.json` would have been committed), plus `.envrc`,
  `mise.local.toml`, `*.pem`, OS junk. Checked: nothing under `.claude/` was
  ever tracked in this repo, so this was inert here --- no reconciliation
  needed, just confirmed via `git ls-files | grep .claude`.
- `cb9af94` --- swapped the two standing reflection prompts to
  breakthrough-first (was developer-identity-first), dropping "aha moment"
  in favour of "breakthrough," in `reflections/README.md` and `CLAUDE.md`.
  Explicitly scoped to those two files only.

**Work this run:** the teaching team's prompt-order commit changes the *rule*
but, correctly per its own stated scope, doesn't touch this repo's actual
`reflections/crit-1.md` content --- so the file was left with the prompts in
the old order. Caught this by re-reading the file against the newly-worded
rule (not just trusting a green `check:evidence`, which only validates
filename/word-count/citations, never prompt order or content shape --- same
class of gap as run 5's stale-heading finding). Reordered the two paragraphs
(commit `34338c9`) so "The breakthrough" now comes first, "What this week
changed about the developer I want to be" second. No prose was rewritten,
only reordered.

Re-ran `pnpm check` (typecheck, build, oxlint, stylelint, 51/51 vitest) and
`pnpm check:evidence` after the edit --- both green. Also did a fresh visual
sanity pass since none had happened since run 3: built, served `dist/` on
localhost:8788, and screenshotted index.html at both 1920×1080 and 390×844
plus gallery.html at desktop. All three look correct --- readable text,
construction banner fix from run 3 still holding, nav wraps cleanly on
mobile, gallery grid renders with images and captions intact. No regressions
found; killed the local server afterward.

Left this run's commit (`34338c9`) unpushed locally, per the
push-only-inside-24h gate --- 93h is well outside it. Expect it to reach
`origin` via the next harness tick-snapshot push, per the established
pattern in `MEMORY.md`.

**Most important next action:** site content, CSS, and process evidence are
all in good shape; no outstanding bugs or gaps found this run. A future run
with time still >24h should: reconcile `git log` against this file (per the
run-4 lesson --- don't trust `now.md` blindly), watch for more
"COMP4020 teaching team"-authored commits as a now-established pattern
alongside "Ben Swift" and the harness tick-snapshot, and specifically
re-check reflection/PROCESS.md *content* (not just the checks) after any
future convenor rule change to the reflection format --- this is the second
time in two runs that a rename/rewording landed on the rule file without
`check:evidence` being able to see whether the actual reflection content
followed. When a run lands inside 24h of cutoff: do the full finishing steps
(local + live verification at both viewports against the deployed URL, final
`PROCESS.md`/reflection check, then push).
