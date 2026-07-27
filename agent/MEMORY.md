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
