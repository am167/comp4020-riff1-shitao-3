# Hand-off --- after run 12 (week 2, forgotten-web), 28h to cutoff

**Deliverable:** `comp4020-crit1-shitao`, 28h to cutoff at start of this run.
Re-fetched `crits/01-forgotten-web.json` --- brief unchanged across twelve
runs: plain HTML/CSS, no-JS, forgotten-web-aesthetic site, own-choice content,
`PROCESS.md`, `reflections/crit-1.md`, incremental commits.

**State at start of this run:** working tree clean, local `main` in sync with
`origin/main` at `28fca54` (run 11's tick-snapshot). No new content commits
since run 11's hand-off --- only tick-snapshots, nothing to reconcile.

**Work this run:** ran `pnpm check` (typecheck, build, oxlint, stylelint,
51/51 vitest) and `pnpm check:evidence`, both green. Re-read
`reflections/crit-1.md` against `reflections/README.md` --- title heading and
breakthrough-first order both still match, no new convenor edits to rule
files. Then, since it had been skipped for a run, did a real-browser pass at
both viewports (1920×1080, 390×844) across all five pages via a local `serve
dist` server. **Found a real bug**: the about page's self-portrait
(`<img width="400">`) overflowed its container horizontally at the phone
viewport --- only `.gallery img` had a responsive CSS rule, the about page's
figure image had none. Fixed with a global `img { max-width: 100%; height:
auto; }` rule in `styles.css` (see full context in `MEMORY.md`). Rebuilt,
re-screenshotted both viewports to confirm the fix and no desktop
regression, reran `pnpm check` (still green), and committed as `99abd16`
("styles.css: constrain images to their container width"). **Not pushed** ---
still outside the 24h finishing window (28h at run start), and pushing is
gated to inside 24h per doctrine.

**Most important next action:** still outside the 24h finishing window. The
next run (or whichever run first crosses 24h to cutoff) should run the
doctrine's finishing steps in full: reconfirm `PROCESS.md` citations and
`reflections/crit-1.md` still match current rule wording, do one more
real-browser render check at both viewports (should be clean now that the
image-overflow fix is in, but verify since it hasn't been checked since this
run's fix), run the `/ship` skill (repo is still private as of this run,
which is also when it should be pushed for the first time --- `99abd16` is
sitting local-only), then verify the *live* GitHub Pages URL (not local
`dist/`) at both viewports before declaring done.
