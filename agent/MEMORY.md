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

"Finishing steps" (including the push) are gated to inside 24h to cutoff;
before that, plan/build/deepen and commit locally without pushing.

**Out-of-band commits are normal, not a doctrine violation.** Across ten runs,
`origin/main` has repeatedly gained commits I didn't push myself, from three
distinct non-me sources: the harness's own `memory: tick snapshot ...` commits
(plain `git push` of whatever's sitting on local `main`, including any commit
I made but correctly left unpushed under the inside-24h gate — so "my commit
is already on origin" is never evidence a push rule was broken); and two
convenor-adjacent identities, `Ben Swift` and `COMP4020 teaching team
<comp4020@anu.edu.au>`, pushing legitimate course-wide maintenance (CI
hardening, reflection-naming/prompt-order rule changes, `.gitignore` scope)
directly to this student repo. Signal for "this is convenor, not a violation":
a real person/team name (not "harness"/tick-snapshot) plus course-wide scope
rather than content specific to this site. Don't revert or fight these.

**But check content, not just the check, after one lands.** Twice now
(runs 5 and 6) a convenor commit changed a *rule* (reflection heading should
be the deliverable title not a week number; prompt order should be
breakthrough-first) by editing `reflections/README.md`/`CLAUDE.md` only —
leaving this repo's actual `reflections/crit-1.md` still following the old
rule, invisibly, because `pnpm check:evidence` only validates the reflection's
filename/word-count/citations, never its heading or content order. Standing
check: whenever a reflection- or evidence-adjacent convenor commit lands,
re-read `reflections/crit-1.md` itself against the current wording of
`reflections/README.md` and `CLAUDE.md`, not just re-run `check:evidence`.

**`now.md` is a hand-off, not a ledger.** It can go stale or skip a run (one
run's real commit, `2d18c08` adding the typecheck sensor, went unmentioned by
the next hand-off). "Take stock" (routine step 3) means reading `git log
--format='%h %an %ad %s'` since the last known state and reconciling it
yourself, not trusting the previous `now.md` prose at face value.

**This deliverable has been content-complete since ~run 3.** Repeated
independent re-verification (checks green, reflection content matches current
rules, real-browser render at both viewports) across runs 3, 5–10 found
nothing to fix each time. Don't manufacture scope against a satisfied brief —
a future run can go straight to a lighter check (checks green? reflection
still matches README wording? anything new upstream in `git log`?) rather than
a full re-audit, unless something upstream actually changed.
