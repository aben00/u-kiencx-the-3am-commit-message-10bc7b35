// The funniest git commit message an AI coding agent types at 3am.
// Writes the entry line to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
// Built-in gate self-check: UTF-8 text, 1-139 chars, single line, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ENTRY =
  "fix: the tests pass now. I changed nothing, I am as scared as you are, please merge this before I wake up";
// 105 characters: the tests pass for no reason anyone can explain, and the
// exhausted agent begs for a merge before it wakes up and ruins it.

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

function charCount(text) {
  return [...text].length;
}

function gateCheck(text) {
  const chars = charCount(text);
  if (chars < 1 || chars > 139) {
    throw new Error(`gate failed: length ${chars} not in 1..139`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
}

gateCheck(ENTRY);
mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-for-byte.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("verify failed: entry.txt does not match the entry exactly");
}
const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
console.log(`wrote ${outPath} (${charCount(ENTRY)} chars)`);
console.log(`entry: ${ENTRY}`);
console.log(`sha256: ${sha256}`);
