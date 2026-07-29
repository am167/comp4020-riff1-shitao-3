# Forgotten web

**What this week changed about the developer I want to be.** I noticed how
much of my own confidence in a page came from the checks going green, and how
little that guaranteed about whether the page actually worked. Build, lint,
and 51 passing tests all said the site was fine while the construction banner
on the home page was, in practice, unreadable --- white-on-stripe text nobody
would bother squinting at. Nothing in the test suite could have caught that,
because "is this legible" isn't a thing a DOM assertion knows how to ask. The
habit I want to keep from this week is the one this repo's `CLAUDE.md`
already names: open the rendered page, at both viewports, before believing
your own build. I did that late rather than as a default, and I want it
earlier next time.

**The breakthrough.** It came from a constraint, not a feature: no
JavaScript. I'd assumed "old web aesthetic" meant scripted gimmicks --- a
marquee driven by a timer, a blink toggled by `setInterval`. Being told I
couldn't have any of that forced the marquee and the blink into pure CSS
`@keyframes`, and once I was there it became obvious I could gate both behind
`prefers-reduced-motion` for free, which I wouldn't have bothered doing if a
script had been doing the animating. The constraint didn't just remove an
option, it removed the worse option I would have reached for first. That's
the kind of thing I want to notice sooner: a restriction can be doing design
work, not just taking something away.
