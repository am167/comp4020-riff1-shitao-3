import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// This week's brief (crits/01-forgotten-web): a real site, a handful of
// readable pages each reachable from home, built with plain HTML/CSS and
// no JavaScript. These tests turn the checkable lines of that brief into
// assertions against the built site --- the invariants that hold for any
// good site regardless of the brief live in invariants.test.ts.
const DIST = resolve("dist");

function htmlFiles(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

function allFiles(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return allFiles(path);
    return [path];
  });
}

const pages = htmlFiles().map((path) => ({
  name: relative(DIST, path),
  doc: new JSDOM(readFileSync(path, "utf8")).window.document,
}));

describe("no JavaScript ships", () => {
  it("built no .js files", () => {
    const jsFiles = allFiles().filter((path) => path.endsWith(".js"));
    expect(jsFiles).toEqual([]);
  });

  for (const { name, doc } of pages) {
    it(`${name} has no <script> tags`, () => {
      expect(doc.querySelectorAll("script").length).toBe(0);
    });

    it(`${name} has no inline event handler attributes`, () => {
      for (const el of doc.querySelectorAll("*")) {
        for (const attr of el.getAttributeNames()) {
          expect(attr.startsWith("on")).toBe(false);
        }
      }
    });
  }
});

describe("a handful of pages, each reachable from home", () => {
  const home = pages.find(({ name }) => name === "index.html");
  const otherPages = pages.filter(({ name }) => name !== "index.html");

  it("ships more than a single page", () => {
    expect(pages.length).toBeGreaterThan(3);
  });

  it("links to every other page from the home page", () => {
    const homeHrefs = [...(home?.doc.querySelectorAll("a[href]") ?? [])].map(
      (a) => a.getAttribute("href"),
    );
    for (const { name } of otherPages) {
      expect(homeHrefs, `home page should link to ${name}`).toContain(
        `./${name}`,
      );
    }
  });
});

describe("readable content, not stubs", () => {
  for (const { name, doc } of pages) {
    it(`${name} has substantive body text`, () => {
      const wordCount = (doc.querySelector("main")?.textContent ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      expect(
        wordCount,
        `${name} main content should read as a real page, not a placeholder`,
      ).toBeGreaterThan(40);
    });
  }
});
