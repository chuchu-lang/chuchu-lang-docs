import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { Prism } from "prism-react-renderer";

const source = await readFile(new URL("../src/theme/chuchu-language.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { chuchuGrammar } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const tokenize = (source) => Prism.tokenize(source, chuchuGrammar);
const typed = (source) => tokenize(source).filter((token) => typeof token !== "string");
const keywords = ["TODO", "NOTE", "CRITICAL", "FIXME", "WARNING", "HACK", "DONE"];

test("annotations color complete line and block comments", () => {
  for (const keyword of keywords) {
    for (const source of [
      `//${keyword}: explanation "text" /* literal */`,
      `// \t${keyword}: explanation`,
      `/*${keyword}: first line\nsecond line */`,
      `/*\r\n ${keyword}: first line\r\nsecond line */`,
    ]) {
      const tokens = typed(source);
      assert.equal(tokens.length, 1, source);
      assert.equal(tokens[0].type, `comment-${keyword.toLowerCase()}`, source);
      assert.equal(tokens[0].content, source);
      assert.equal(tokens[0].alias, "comment");
    }
  }
});

test("only an uppercase keyword at the start selects a color", () => {
  for (const source of ["//todo: text", "// TODO text", "// context TODO: text", "//UNKNOWN: text", "/* context NOTE: text */"]) {
    assert.equal(typed(source)[0].type, "comment", source);
  }
});

test("comments, strings, division, and following code stay distinct", () => {
  assert.equal(typed('"https://example.com /*NOTE: text */"')[0].type, "string");
  assert.equal(typed('"//CRITICAL: text"')[0].type, "string");
  assert.equal(typed('/* " quote //TODO: text */')[0].type, "comment");
  assert.equal(typed('//NOTE: outer //CRITICAL: inner')[0].type, "comment-note");
  assert.deepEqual(typed("/*NOTE: block */show 6 / 2 //TODO: tail\nshow 3").map((t) => t.type),
    ["comment-note", "keyword", "number", "operator", "number", "comment-todo", "keyword", "number"]);
  assert.equal(typed("/* unterminated")[0].type, "comment");
  assert.equal(typed("/*CRITICAL: unterminated")[0].type, "comment-critical");
});

test("every annotation has explicit light and dark theme colors", async () => {
  const css = await readFile(new URL("../src/css/custom.css", import.meta.url), "utf8");
  for (const keyword of keywords) {
    const tag = keyword.toLowerCase();
    assert.match(css, new RegExp(`\\.token\\.comment-${tag} \\{ color: #[0-9a-f]{6} !important; \\}`));
    assert.ok(css.includes(`[data-theme='dark'] .token.comment-${tag}`));
  }
});

test("be highlights as a keyword with identifier boundaries", () => {
  assert.deepEqual(typed("function greet(name: string) be string").filter((t) => t.type === "keyword").map((t) => t.content),
    ["function", "be"]);
  assert.deepEqual(typed("before be_value"), []);
  assert.deepEqual(typed("->").map((t) => t.content), ["-", ">"]);
});

test("input highlights as a built-in with or without a prompt", () => {
  for (const source of ['input()', 'input("x = ")', 'try_input()', 'try_input("x = ")']) {
    assert.equal(typed(source)[0].type, "builtin");
    assert.equal(typed(source)[0].content, source.split("(")[0]);
  }
  assert.equal(typed("read_line()")[0].type, "function");
});
