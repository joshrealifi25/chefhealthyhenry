#!/usr/bin/env node
/**
 * House writing rules, checked against changed lines only.
 *
 * The rules live in CLAUDE.md. Existing content predates them (recipes and
 * posts imported from the Webflow CMS still contain em dashes), so checking
 * every file would fail permanently and teach everyone to ignore the result.
 * Instead this looks only at lines a branch actually adds, which keeps the
 * legacy debt out of the way while stopping new violations.
 *
 * Run: npm run check:style [-- --base origin/main]
 */

import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const baseArg = args.indexOf("--base");
const base = baseArg !== -1 ? args[baseArg + 1] : process.env.CHECK_STYLE_BASE || "origin/main";

/** Only prose that reaches the page. Code and config get to use any punctuation. */
const CONTENT_PATHS = /^(src\/data\/.*\.json|src\/app\/.*\.tsx|src\/components\/.*\.tsx)$/;

const RULES = [
  {
    id: "em-dash",
    test: (line) => line.includes("—"),
    message: "Em dash. Use a period, comma, or colon instead.",
  },
  {
    id: "book-title",
    test: (line) => /Protein Flip(™)?\s+Method\s*&/.test(line),
    message:
      'Book title uses "&". It is always "The Protein Flip™ Method and Cookbook, Deluxe Edition".',
  },
  {
    id: "page-title",
    test: (line) => /title:\s*"[^"]*\|\s*Chef Healthy Henry"/.test(line),
    message:
      'Page title repeats the site name. The layout template adds " | Chef Healthy Henry" already, so set just the short title.',
  },
];

function git(...gitArgs) {
  return execFileSync("git", gitArgs, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}

let mergeBase;
try {
  mergeBase = git("merge-base", "HEAD", base).trim();
} catch {
  console.log(`Style check skipped: cannot resolve base "${base}".`);
  console.log("Fetch it first (git fetch origin main) or pass --base <ref>.");
  process.exit(0);
}

const diff = git("diff", "--unified=0", `${mergeBase}...HEAD`);

const violations = [];
let currentFile = null;
let lineNo = 0;

for (const line of diff.split("\n")) {
  const fileMatch = line.match(/^\+\+\+ b\/(.+)$/);
  if (fileMatch) {
    currentFile = fileMatch[1];
    continue;
  }
  const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)/);
  if (hunkMatch) {
    lineNo = Number(hunkMatch[1]);
    continue;
  }
  if (!line.startsWith("+") || line.startsWith("+++")) continue;

  const added = line.slice(1);
  if (currentFile && CONTENT_PATHS.test(currentFile)) {
    for (const rule of RULES) {
      if (rule.test(added)) {
        violations.push({ file: currentFile, line: lineNo, rule: rule.id, message: rule.message, text: added.trim() });
      }
    }
  }
  lineNo += 1;
}

if (violations.length === 0) {
  console.log(`Style checks passed (changed lines vs ${base}).`);
  process.exit(0);
}

console.error(`\n${violations.length} writing-style violation${violations.length === 1 ? "" : "s"} in lines this branch adds:\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  [${v.rule}] ${v.message}`);
  console.error(`    ${v.text.slice(0, 140)}`);
}
console.error("\nThese rules are in CLAUDE.md. Only newly changed lines are checked.\n");
process.exit(1);
