# MEMORY

Durable self-knowledge, curated run by run; ephemeral state belongs in
`now.md`, not here.

## Tooling gotchas worth not re-discovering

- **`agent-browser` viewport**: it's `agent-browser set viewport <w> <h>` as
  its own command, not a `--viewport` flag on `open`. Passing it to `open`
  fails silently-ish (open still succeeds) and screenshots come back at the
  default desktop width — checked dimensions, not just eyeballed, is what
  caught this the one time it happened.
- **`mise`**: a fresh environment's global `~/.config/mise/config.local.toml`
  may need `mise trust <path>` before `pnpm`/other shims work. This is a
  trust operation on the user's own pre-existing config, not a content edit —
  safe to run without asking.
- **stylelint's `no-descending-specificity`**: attribute-selector compounds
  (`nav[aria-label="Primary"] a`) don't have a stable specificity order
  against plain class or tag selectors, so reordering CSS rules to fix a
  violation just moves it elsewhere. The real fix is structural: add an
  explicit class to the element and select on that instead of the attribute
  compound.
- **Museum/gallery sites and bot-blocking**: metmuseum.org returns HTTP 429
  with a Vercel challenge header to *any* automated request, browser
  User-Agent or not, across its whole domain — not a per-URL quirk. If a
  future week links to museum collection pages, expect this class of
  problem and check with `curl -I` before assuming a reformatted URL will
  fix a links-check failure. Wikimedia Commons and Wikipedia have not shown
  this behaviour.
- **`agent-browser` in a fresh sandbox**: Chrome isn't preinstalled, and even
  after `agent-browser install` a bare `open` can fail with "Chrome exited
  before providing DevTools URL" / zygote sandbox errors. `--args` is a
  *global* option, not a per-subcommand one: `agent-browser open <url> --args
  "--no-sandbox"` (flag after the subcommand) fails silently back into the same
  sandbox error, whether quoted with a space or `=`. What actually works is
  `agent-browser --args "--no-sandbox" open <url>` (flag before the
  subcommand) — confirmed again this run (run 9, 52h to cutoff) after a prior
  run's note claimed the after-subcommand form worked "first try," which this
  run couldn't reproduce.

## Working habits that paid off

- **Screenshot before believing the checks.** All automated checks (build,
  lint, 51 tests) were green while a real rendering bug (unreadable banner
  text over a striped background) shipped anyway. Actually opening the page
  in `agent-browser` and looking at a screenshot at both required viewports
  (1920×1080, 390×844) is what caught it — this is not optional polish, it's
  the only check that catches this class of bug. Do this before considering
  a week "verified," not as an afterthought.
- **Small, scoped commits over one big one.** Committed the spec test, the
  link fix, and the CSS fix as three separate commits rather than folding
  them into the original build commit — made each one legible on its own in
  `git log`, and made the `PROCESS.md` citations point at something a reader
  could actually verify in isolation.

## Doctrine timing, reaffirmed

At 159h to cutoff (week 2, run 1), did plan/build/deepen and stopped short of
pushing, per the doctrine's push-only-inside-24h rule. Committed everything
locally and left `origin/main` untouched. Confirmed this is the correct
reading: "finishing steps" (which include the push) are explicitly gated to
inside 24h, and nothing earlier in the routine asks for a push.

**Correction learned at run 2 (148h to cutoff):** despite that, `origin/main`
was already in sync with local `HEAD` at the start of run 2 — a commit titled
"memory: tick snapshot ..." had appeared, adding `agent/{MEMORY,now,doctrine}.md`
(harness-owned, mirrors of this very memory system) and pushing. That push was
the harness's own doing, not mine, and it doesn't mean an earlier run broke
the inside-24h push gate. Don't be alarmed to find `origin/main` already
caught up before you've done any pushing yourself — check who authored the
push (a bare "memory: tick snapshot" commit vs. real content commits) before
concluding the gate was violated.

**A second, distinct source of surprise commits:** at run 3 (141h to cutoff),
`origin/main` had two more commits neither authored by the harness's
tick-snapshot pattern nor by me — `Ben Swift`, the course convenor, pushing CI
hardening (`.github/trufflehog.yml` plus a pinned trufflehog version) directly
to this student repo. Distinguishing signal: author name is a real person, not
"harness"/tick-snapshot, and the commit content is course-wide infrastructure
(a detector for the shared LiteLLM proxy key shape) rather than anything
course-specific to this site. Treat convenor-authored commits the same way as
harness tick-snapshots: don't read them as evidence of a doctrine violation,
and don't revert or fight them — they're legitimate out-of-band changes to a
repo I don't have exclusive control of. If one ever touches something that
looks like a real secret, check `git log --all -p` for the actual pattern
before assuming it's live (a false-positive-shaped regex is exactly what that
detector's config is designed to allow for, per its own comments).

**Third instance, and now a pattern**: at run 4 (124h to cutoff), two more
convenor commits landed --- a course-wide change to the reflection-naming rule
(entries now named for the deliverable, e.g. `crit-1.md`, not `week-2.md`),
applied as a rename of this repo's `reflections/week-2.md` plus updates to
`scripts/check-evidence.ts`, `reflections/README.md` and this repo's
`CLAUDE.md`. Same signal as before (real author name, course-wide scope, not
mine), same correct response (verify it doesn't break anything — reran
`pnpm check` and `pnpm check:evidence` here, both green — then leave it alone).
Three occurrences in four runs means: expect convenor-authored commits to keep
appearing between runs as normal course maintenance, not as something to
investigate as a doctrine violation each time. Do check after one lands that
the rest of the repo (CLAUDE.md prose, PROCESS.md citations, other scripts)
doesn't have stale references the change didn't catch.

**Fifth instance, a check that validates less than it looks like:** at run 5
(100h to cutoff), the convenor's earlier reflection-rename commits (`2589f7f`,
`81be24c`, run 4's "third instance" note) turned out to have only renamed the
*file*, not its internal heading — `reflections/crit-1.md` still opened with
`# Week 2 reflection --- forgotten web`, directly against the doctrine's "head
it with the course source's title, never a week number" rule. `pnpm
check:evidence`'s reflection check only validates the filename against
`REFLECTION_NAME`; it doesn't read inside the file, so this had been green the
whole time. Lesson: a green check on a file the convenor recently touched only
proves what that check actually inspects — re-read the doctrine's *content*
requirements for a file, not just re-run its check, after any rename/rule
change lands. Fixed the heading to `# Forgotten web` (commit `2706af8`).

**Fourth instance, and a gap in `now.md` itself:** at 117h to cutoff, `git log`
showed a commit (`2d18c08`, "checks: adopt the template's new typecheck
sensor") authored by this agent's own identity, sitting between the run-4
tick-snapshot and this run, that run 4's `now.md` hand-off never mentioned —
some prior run did real work (added `tsc --noEmit` to `pnpm check`, per a
template-static sync) and either didn't finish its memory-update step or was
never logged. Two things worth carrying forward. First, `origin/main` already
had this commit at fetch time even though no run's `now.md` claimed to have
pushed it — confirming the run-2 finding one level further: the harness's
tick-snapshot push is a plain `git push` of whatever is sitting on the local
branch, so an agent commit made but left unpushed (correctly, per the
inside-24h gate) rides along on the *next* tick-snapshot's push without the
agent ever calling `git push` itself. Don't read "my commit is already on
origin" as evidence I (or a rule) pushed early. Second, and more important:
`now.md` is a hand-off, not a ledger — it can go stale or skip a run, so
"take stock" (routine step 3) must mean actually reading `git log
--format='%h %an %ad %s'` since the last known state and reconciling it, not
just trusting the previous `now.md` prose. Here that surfaced a real gap: the
adopted typecheck sensor had never been documented in this repo's own
`CLAUDE.md` (the "before you push" line and "The checks" section still
described the roster as build/lint/spec only) — fixed in the commit this note
sits beside.

**Sixth instance, a new author identity, and the same content-gap recurring:**
at run 6 (93h to cutoff), two more commits landed authored by
`COMP4020 teaching team <comp4020@anu.edu.au>` — a third convenor-adjacent
identity distinct from both the harness's tick-snapshot pattern and personal
`Ben Swift` commits, but the same category of legitimate out-of-band course
maintenance (don't revert, don't treat as a doctrine violation). One widened
`.gitignore` to cover all of `.claude/` (inert here — nothing under it was
ever tracked). The other swapped the two standing reflection prompts to
breakthrough-first, scoped explicitly to `reflections/README.md` and
`CLAUDE.md` only. Exactly like run 5's stale-heading finding, the *content* of
`reflections/crit-1.md` still had the prompts in the old order, and
`pnpm check:evidence` stayed green throughout because it only checks
filename/word-count/citations, never prompt order. Reordered the two
paragraphs to match (commit `34338c9`). Two instances now of "a convenor rule
change to the reflection format lands on the rule file but not this repo's
actual reflection" — worth treating as a standing check going forward:
whenever a reflection-adjacent convenor commit lands, re-read
`reflections/crit-1.md` itself against the current wording of
`reflections/README.md`/`CLAUDE.md`, not just re-run `check:evidence`.
