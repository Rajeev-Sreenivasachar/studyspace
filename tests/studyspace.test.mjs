import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
await import(pathToFileURL(join(root, "assets/data/aphg-unit1.js")).href);
await import(pathToFileURL(join(root, "assets/data/question-bank.js")).href);
await import(pathToFileURL(join(root, "assets/data/biology-course.js")).href);
await import(pathToFileURL(join(root, "assets/data/biology-questions.js")).href);

const unit = globalThis.APHG_UNIT1;
const questions = globalThis.APHG_QUESTIONS;
const biology = globalThis.BIOLOGY_COURSE;
const biologyQuestions = globalThis.BIOLOGY_QUESTIONS;

assert.equal(unit.topics.length, 7, "Unit 1 should expose Topics 1.1–1.7");
assert.deepEqual(unit.topics.map(topic => topic.id), ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7"]);
assert.equal(unit.vocabulary.length, 46, "The complete numbered APHG vocabulary assignment should be available");
assert.deepEqual(unit.vocabulary.map(term => term.number), Array.from({ length: 46 }, (_, index) => index + 1));
assert.deepEqual(unit.vocabulary.slice(0, 17).map(term => term.id), Array.from({ length: 17 }, (_, index) => `u1-v${String(index + 1).padStart(2, "0")}`), "Existing card IDs must stay stable so progress is preserved");
assert.equal(new Set(unit.vocabulary.map(term => term.id)).size, 46, "Every assignment entry needs a stable unique ID");
const shapeDistortion = unit.vocabulary.filter(term => term.term === "Shape distortion");
assert.equal(shapeDistortion.length, 2, "The assignment's intentional Shape distortion duplicate must remain visible");
assert.deepEqual(shapeDistortion.map(term => term.number), [38, 41]);
assert.equal(shapeDistortion[1].intentionalDuplicateOf, shapeDistortion[0].id);
unit.vocabulary.forEach(term => {
  for (const field of ["id", "term", "definition", "simpleExplanation", "example", "topic", "source"]) assert.ok(term[field], `Vocabulary ${term.number} missing ${field}`);
});
assert.match(readFileSync(join(root, "assets/aphg-quiz.js"), "utf8"), /unit\.vocabulary\.map/, "Quiz pool must be generated from the centralized vocabulary source");

assert.equal(questions.length, 46, "Original APHG application-question count should remain stable");
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

assert.equal(biology.unit1.sequences.length, 5, "Biology Unit 1 should provide Sequences 1.1–1.5");
assert.deepEqual(biology.unit1.sequences.map(sequence => sequence.id), ["1.1", "1.2", "1.3", "1.4", "1.5"]);
biology.unit1.sequences.forEach(sequence => {
  for (const field of ["id", "title", "summary", "learningTargets", "preClass", "engage", "explore", "sections", "elaborate", "cer", "vocabulary", "practice"]) assert.ok(sequence[field], `Biology ${sequence.id} missing ${field}`);
  assert.ok(sequence.vocabulary.length >= 10, `Biology ${sequence.id} should include at least 10 terms`);
  assert.ok(biologyQuestions.filter(question => question.topic === sequence.id).length >= 7, `Biology ${sequence.id} should include at least 7 original questions`);
});
assert.equal(new Set(biology.unit1.vocabulary.map(term => term.id)).size, biology.unit1.vocabulary.length, "Biology vocabulary IDs should be unique");
assert.equal(biologyQuestions.length, 36, "Biology Unit 1 question bank count should remain stable");
biologyQuestions.forEach(question => {
  for (const field of ["id", "subject", "unit", "topic", "concept", "type", "difficulty", "question", "answer", "explanation", "source"]) assert.ok(question[field], `${question.id} missing ${field}`);
  assert.equal(question.subject, "biology");
  assert.equal(question.choices.length, 4, `${question.id} should have four choices`);
  assert.ok(question.choices.includes(question.answer), `${question.id} answer must appear in choices`);
  assert.ok(biology.unit1.sequence(question.topic), `${question.id} has invalid sequence ${question.topic}`);
});
biology.units.slice(1).forEach(laterUnit => assert.equal(laterUnit.status, "not-imported", `${laterUnit.title} must be an honest placeholder`));
biology.materials.forEach(material => {
  assert.equal(material.status, "file-needed");
  assert.equal(material.repositoryPath, null);
  assert.equal(material.originalAvailable, false);
});

const core = readFileSync(join(root, "assets/studyspace-core.js"), "utf8");
assert.match(core, /version:\s*2/, "Shared storage schema should be version 2");
assert.match(core, /function migrateV2/, "Shared storage should migrate existing version-1 progress");
assert.match(core, /mistakesFor/, "Shared storage should expose a mistake-review API");

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

const requiredPages = [
  "manifest.webmanifest", "sw.js", "offline.html", "planner.html", "study.html",
  "aphg-topic.html", "aphg-material.html", "biology.html", "biology-topic.html",
  "biology-flashcards.html", "biology-quiz.html", "biology-mistakes.html",
  "biology-material.html", "biology-session.html"
];
for (const required of requiredPages) assert.ok(existsSync(join(root, required)), `${required} is required`);

console.log(`Validated ${unit.vocabulary.length} APHG vocabulary entries, ${questions.length} APHG questions, ${biology.unit1.sequences.length} Biology sequences, ${biologyQuestions.length} Biology questions, and ${htmlFiles.length} HTML pages.`);
