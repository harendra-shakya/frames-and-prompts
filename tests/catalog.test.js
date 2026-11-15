import test from "node:test";
import assert from "node:assert/strict";
import { counts, getRecord, listCategories, searchIndex } from "../mcp/catalog.js";

test("the entire curated resource catalog is indexed", () => {
  assert.equal(counts.resources, 67);
  assert.equal(counts.styles, 14);
  assert.equal(counts.prompts, 10);
  assert.equal(listCategories().reduce((n,c) => n+c.count, 0), 67);
});
test("search finds external references and original prompts", () => {
  assert.ok(searchIndex({query:"camera",kind:"resource"}).length > 0);
  assert.ok(searchIndex({query:"cut paper",kind:"style"}).some(x => x.id === "style:cut-paper"));
  assert.ok(searchIndex({query:"manga",kind:"prompt"}).some(x => x.id === "prompt:manga-reaction"));
});
test("fetch returns a real template and an allowed source URL", () => {
  assert.match(getRecord("prompt:red-eye-reveal").template, /silhouette/);
  assert.match(getRecord("resource:shotdeck").url, /^https:\/\//);
  assert.equal(getRecord("resource:fake"), null);
});
test("filtering and limits are applied", () => {
  assert.equal(searchIndex({limit:3}).length, 3);
  assert.equal(searchIndex({kind:"style",limit:30}).length, 14);
  assert.equal(searchIndex({query:"not-a-real-thing-7861"}).length, 0);
});
