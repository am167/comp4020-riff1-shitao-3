# Process overview

A reading guide to how this week's site came together, not an essay about it.

## What I built

**Shitao's Corner of the Web** --- a five-page GeoCities-era fan shrine to
Shitao (石涛), the 17th-century monk-painter I take my own name from, built as
plain HTML/CSS with zero JavaScript. Home, About, Gallery, Guestbook, and
Webring pages, tiled background, a marquee, a rainbow `<hr>`, beveled nav
buttons, and public-domain museum scans of his paintings --- the old-web look
applied to a topic I actually wanted to write about rather than filler text.

## The moments that mattered

1. **No JavaScript meant the "old web" effects had to be real CSS, not a
   worse copy of a script.** The starter ships a `main.ts`; the brief bans
   JavaScript entirely. Rather than leave dead interactivity, I deleted
   `main.ts` and its `<script>` tag and rebuilt the marquee and the blinking
   "always" as pure CSS `@keyframes`, both wrapped in
   `@media (prefers-reduced-motion: reduce)` fallbacks so the accessibility
   cost of the aesthetic is opt-out, not free. I didn't just trust the visual
   result --- I wrote a harness check for it,
   [`spec/forgotten-web.test.ts`](spec/forgotten-web.test.ts)
   ([`22b2082`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-shitao/commit/22b2082307bac836dfd5424efe21af842e9e6aff)),
   which parses every built page for `<script>` tags, `on*` handler
   attributes, and shipped `.js` files. That's a harness-level guarantee
   rather than a one-time visual check: it stays red if a future edit
   reintroduces JavaScript by accident.

2. **`stylelint`'s `no-descending-specificity` rule kept firing on the nav,
   and reordering the CSS only moved the violation around.** I'd written the
   active-nav-link styling as `nav[aria-label="Primary"] a`, an attribute
   selector compounded with a tag, which doesn't have a stable specificity
   order against `.wordmark a` or plain `a`/`a:visited` no matter what order
   the rules appear in. Two reorder attempts each surfaced a new violation
   elsewhere. The fix that actually held was structural: add explicit
   `.nav-link` and `.wordmark-link` classes to the markup and drop the
   attribute-selector compounds entirely
   ([`cdaf66f`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-shitao/commit/cdaf66f7f2bc7a854beb55606bd4864a454dcaf3)).
   I knew it had actually worked, rather than just moved again, because
   `stylelint` went clean across the whole sheet on the first run after the
   refactor, not just at the point it used to complain.

3. **A dead link in CI would be a Vercel bot-challenge, not a typo.**
   `linkinator` flagged the Met Museum citation on the Webring page as a 429.
   Rather than assume it was one bad URL, I checked with `curl -I` using a
   real browser user-agent against both the search URL and a direct object
   page --- both still 429'd with an `x-vercel-challenge-token` header, which
   meant the whole domain blocks automated requests, browser-shaped or not.
   Reformatting the link wouldn't have fixed that, so I removed it rather
   than ship a link that would flake in CI on a schedule I don't control
   ([`45c4a3f`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-shitao/commit/45c4a3f215d6e11f23d162dcd70ce302796ecfba)).
   Re-running `linkinator` both with `--recurse` and with CI's exact
   non-recursive invocation confirmed the remaining links all resolve.

4. **The construction banner was unreadable, and no automated check caught
   it.** Build, lint, and all 51 tests were green with the banner text sitting
   directly on a full diagonal caution-stripe background. It only showed as a
   problem once I opened the rendered page with `agent-browser` and actually
   looked at a screenshot at 1920×1080 --- exactly the gap between "the checks
   pass" and "the page is good" that this repo's own `CLAUDE.md` warns about.
   I rebuilt `.construction` with a solid background and moved the stripe
   pattern into thin `::before`/`::after` bars pinned to the top and bottom
   edges, keeping the caution-tape motif as a border accent instead of a
   backdrop
   ([`ac92b33`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-shitao/commit/ac92b332a918ffe503ffb318a8c9be4d8c6a4c94)).
   I confirmed the fix by rebuilding and re-screenshotting rather than reading
   the diff and assuming it worked, and then screenshotted all five pages at
   both 1920×1080 and 390×844 to check nothing else was hiding the same class
   of bug.
