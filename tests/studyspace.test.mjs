import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
await import(pathToFileURL(join(root, "assets/data/aphg-unit1.js")).href);
await import(pathToFileURL(join(root, "assets/data/question-bank.js")).href);

const unit = globalThis.APHG_UNIT1;
const questions = globalThis.APHG_QUESTIONS;
assert.equal(unit.topics.length, 7, "Unit 1 should expose Topics 1.1–1.7");
assert.deepEqual(unit.topics.map(topic => topic.id), ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7"]);
assert.equal(unit.vocabulary.length, 17, "Only the 17 authoritative numbered terms are currently available");
assert.deepEqual(unit.vocabulary.map(term => term.number), Array.from({ length: 17 }, (_, index) => index + 1));
assert.equal(new Set(unit.vocabulary.map(term => term.term.toLowerCase())).size, unit.vocabulary.length, "Duplicate terms should not create duplicate cards");
unit.vocabulary.forEach(term => {
  for (const field of ["id", "term", "definition", "simpleExplanation", "example", "topic", "source"]) assert.ok(term[field], `Vocabulary ${term.number} missing ${field}`);
});
assert.equal(questions.length, 46, "Question bank count should remain stable");
questions.forEach(question => {
  for (const field of ["id", "subject", "unit", "topic", "type", "difficulty", "question", "answer", "explanation"]) assert.ok(question[field], `${question.id} missing ${field}`);
  assert.equal(question.choices.length, 4, `${question.id} should have four choices`);
  assert.ok(question.choices.includes(question.answer), `${question.id} answer must appear in choices`);
  assert.ok(unit.topic(question.topic), `${question.id} has invalid topic ${question.topic}`);
});
assert.deepEqual(unit.materials.map(material => material.originalPath), [null, null, null, null], "Missing originals must not expose local paths");
assert.equal(unit.topic("1.1").sourceStatus, "teacher");
assert.equal(unit.topic("1.6").sourceStatus, "teacher");
for (const id of ["1.2", "1.3", "1.4", "1.5", "1.7"]) assert.equal(unit.topic(id).sourceStatus, "awaiting-amsco");

const htmlFiles = readdirSync(root).filter(file => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = readFileSync(join(root, file), "utf8");
  const links = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(match => match[1]);
  for (const link of links) {
    if (/^(?:https?:|data:|#|\/\/)/.test(link) || link.includes("${")) continue;
    const local = link.split(/[?#]/)[0];
    if (!local || local === "/api/chat") continue;
    assert.ok(existsSync(join(root, local)), `${file} references missing ${local}`);
  }
}

for (const required of ["manifest.webmanifest", "sw.js", "offline.html", "planner.html", "study.html", "aphg-topic.html", "aphg-material.html"]) assert.ok(existsSync(join(root, required)), `${required} is required`);
console.log(`Validated ${unit.vocabulary.length} verified vocabulary entries, ${questions.length} questions, ${unit.topics.length} topics, and ${htmlFiles.length} HTML pages.`);
