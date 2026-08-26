import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
await import(pathToFileURL(join(root, "assets/data/aphg-unit1.js")).href);
await import(pathToFileURL(join(root, "assets/data/question-bank.js")).href);
await import(pathToFileURL(join(root, "assets/data/biology-course.js")).href);
await import(pathToFileURL(join(root, "assets/data/biology-questions.js")).href);
await import(pathToFileURL(join(root, "assets/data/algebra2-chapter1.js")).href);
await import(pathToFileURL(join(root, "assets/data/course-frameworks.js")).href);
await import(pathToFileURL(join(root, "assets/data/middleton-course-library.js")).href);
await import(pathToFileURL(join(root, "assets/data/full-course-content.js")).href);

const unit = globalThis.APHG_UNIT1;
const questions = globalThis.APHG_QUESTIONS;
const biology = globalThis.BIOLOGY_COURSE;
const biologyQuestions = globalThis.BIOLOGY_QUESTIONS;
const algebra = globalThis.ALGEBRA2_CHAPTER1;
const frameworks = globalThis.STUDYSPACE_COURSES;
const learning = globalThis.STUDYSPACE_LEARNING;
const middleton = globalThis.MIDDLETON_COURSE_LIBRARY;

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
biology.units.slice(1).forEach(laterUnit => assert.equal(laterUnit.status, "class-source-needed", `${laterUnit.title} must keep missing class-specific source status explicit`));
biology.materials.forEach(material => {
  assert.equal(material.status, "file-needed");
  assert.equal(material.repositoryPath, null);
  assert.equal(material.originalAvailable, false);
});

assert.equal(algebra.sections.length, 6, "Algebra 2 Chapter 1 should provide Sections 1.1–1.6");
assert.deepEqual(algebra.sections.map(section => section.id), ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6"]);
algebra.sections.forEach(section => {
  for (const field of ["id", "title", "description", "skills", "lessons", "workedExamples", "visual"]) assert.ok(section[field], `Algebra ${section.id} missing ${field}`);
  assert.ok(section.skills.length >= 5, `Algebra ${section.id} should expose at least five measurable skills`);
  assert.ok(section.lessons.length >= 3, `Algebra ${section.id} should expose at least three short lessons`);
  assert.ok(section.workedExamples.length >= 2, `Algebra ${section.id} should expose two worked examples`);
  assert.ok(algebra.generatorTypes[section.id] >= 6, `Algebra ${section.id} needs at least six generated problem templates`);
  for (let index = 0; index < 30; index += 1) {
    const question = algebra.generate(section.id);
    for (const field of ["id", "subject", "unit", "topic", "concept", "type", "difficulty", "prompt", "hints", "explanation", "mistakeCategory", "answer"]) assert.ok(question[field], `Generated Algebra ${section.id} question missing ${field}`);
    assert.equal(question.subject, "algebra2");
    assert.ok(question.hints.length >= 3, `${question.id} must provide three progressive hints`);
    assert.equal(question.check(question.answer), true, `${question.id} must accept its own answer`);
    if (question.inputType === "choice") assert.ok(question.choices.includes(question.answer), `${question.id} answer must appear in choices`);
  }
});
assert.equal(algebra.flashcards.length, 24, "Algebra Chapter 1 should provide 24 quick-review cards");
assert.equal(new Set(algebra.flashcards.map(card => card.id)).size, algebra.flashcards.length, "Algebra card IDs should be unique");
algebra.flashcards.forEach(card => { for (const field of ["id", "topic", "term", "definition", "example", "concept", "subject"]) assert.ok(card[field], `${card.id} missing ${field}`); });

const expectedCourses = ["aphg", "algebra2", "biology", "thinking-skills", "csit-foundations", "csit-essentials", "english", "orchestra"];
expectedCourses.forEach(courseId => assert.ok(frameworks.course(courseId), `${courseId} must remain available after the Middleton expansion`));
assert.equal(frameworks.course("aphg").units.length, 7, "APHG must expose all seven official units");
frameworks.course("aphg").units.forEach(courseUnit => {
  assert.ok(courseUnit.requiredKnowledge.length >= 3, `APHG Unit ${courseUnit.id} needs required-knowledge checkpoints`);
  assert.equal(courseUnit.practice.type, "original-ap-style", `APHG Unit ${courseUnit.id} needs original AP-style practice`);
  assert.ok(courseUnit.practice.choices.includes(courseUnit.practice.answer), `APHG Unit ${courseUnit.id} practice answer must be a choice`);
});
assert.equal(frameworks.course("csit-essentials").units.length, 14, "CSIT Essentials must preserve the Cisco 14-module structure");
assert.equal(frameworks.course("thinking-skills").courseCode, "9694");
assert.equal(frameworks.course("csit-foundations").frameworkStatus, "needs-class-identification", "Ambiguous local course names must not receive invented standards");
for (const course of Object.values(frameworks.courses)) {
  for (const field of ["id", "title", "frameworkStatus", "frameworkSourceId", "summary", "sources", "skills", "units"]) assert.ok(course[field], `${course.id} missing ${field}`);
  const priorities = Object.fromEntries(course.sources.map(source => [source.type, source.priority]));
  assert.equal(priorities["official-framework"], 1, `${course.id} official source must have first priority`);
  assert.equal(priorities["teacher-class-material"], 2, `${course.id} class source must have second priority`);
  assert.equal(priorities["studyspace-generated"], 3, `${course.id} StudySpace source must have third priority`);
  course.sources.forEach(source => {
    assert.ok(!String(source.url || "").match(/^[A-Z]:\\|AppData|Temp/i), `${course.id} must not expose temporary local paths`);
  });
  course.units.forEach(courseUnit => {
    assert.ok(courseUnit.topics.length, `${course.id} ${courseUnit.id} needs topics or an explicit information request`);
    courseUnit.sourceIds.forEach(sourceId => assert.ok(frameworks.findSource(course, sourceId), `${course.id} ${courseUnit.id} has unknown source ${sourceId}`));
    courseUnit.topics.forEach(courseTopic => courseTopic.sourceIds.forEach(sourceId => assert.ok(frameworks.findSource(course, sourceId), `${course.id} ${courseTopic.id} has unknown source ${sourceId}`)));
  });
}
for (const courseId of ["aphg", "algebra2", "biology", "csit-essentials"]) assert.ok(frameworks.course(courseId).units.some(item => item.classSequence), `${courseId} must preserve its known class sequence`);

let completeLessonCount = 0;
for (const courseId of expectedCourses) {
  const complete = learning.course(courseId);
  assert.ok(complete, `${courseId} needs complete learning content`);
  assert.equal(complete.units.length, frameworks.course(courseId).units.length, `${courseId} learning units must match the framework`);
  complete.units.forEach(courseUnit => {
    assert.equal(courseUnit.lessons.length, courseUnit.topics.length, `${courseId} ${courseUnit.id} needs one real lesson per topic`);
    courseUnit.lessons.forEach(lesson => {
      completeLessonCount += 1;
      assert.ok(lesson.overview.length > 100, `${lesson.id} needs a substantive overview`);
      assert.ok(lesson.objectives.length >= 3, `${lesson.id} needs learning objectives`);
      assert.ok(lesson.sections.length >= 3, `${lesson.id} needs multiple teaching sections`);
      assert.ok(lesson.vocabulary.length >= 5, `${lesson.id} needs usable flashcards`);
      assert.ok(lesson.practice.length >= 4, `${lesson.id} needs progressive practice`);
      assert.ok(lesson.questions.length >= 4, `${lesson.id} needs a mastery check bank`);
      assert.ok(lesson.example && lesson.misconception && lesson.visual, `${lesson.id} needs an example, misconception, and visual model`);
      lesson.questions.forEach(question => {
        assert.equal(question.choices.length, 4, `${question.id} needs four choices`);
        assert.ok(question.answer >= 0 && question.answer < question.choices.length, `${question.id} answer index is invalid`);
      });
    });
  });
}
assert.ok(completeLessonCount >= 280, "The full course catalog should expose at least 280 complete lessons");

const verifiedMiddleton = middleton.list();
assert.ok(verifiedMiddleton.length >= 170, "The latest Middleton programming-sheet audit should expose the full verified library");
assert.equal(verifiedMiddleton.length, new Set(verifiedMiddleton.map(course => course.id)).size, "Middleton course IDs must be unique");
assert.equal(middleton.schoolYear, "2025-2026", "The library must not falsely label the older school-specific programming set as 2026-2027");
assert.ok(middleton.collections.ap().length >= 20, "The AP collection must include every AP title verified on the Middleton sheets");
assert.ok(middleton.collections.aice().length >= 9, "The AICE collection must include every AICE title verified on the Middleton sheets");
let middletonLessonCount = 0;
for (const course of verifiedMiddleton) {
  for (const field of ["id", "title", "courseCode", "subject", "level", "gradeLevels", "credits", "prerequisites", "schoolAvailability", "program", "source", "sourceYear", "status", "units"]) assert.notEqual(course[field], undefined, `${course.id} missing library metadata ${field}`);
  assert.equal(course.availabilityStatus, "verified-middleton", `${course.id} must have school-specific availability evidence`);
  assert.equal(course.sourceYear, "2025-2026", `${course.id} must keep the actual school source year`);
  assert.ok(!String(course.offeringSourceUrl || "").match(/^[A-Z]:\\|AppData|Temp/i), `${course.id} must not expose a local source path`);
  const complete = learning.course(course.id);
  assert.ok(complete, `${course.id} needs a usable learning course`);
  complete.units.forEach(courseUnit => courseUnit.lessons.forEach(lesson => {
    middletonLessonCount += 1;
    assert.ok(lesson.overview.length > 100, `${lesson.id} needs a substantive overview`);
    assert.ok(lesson.objectives.length >= 3 && lesson.sections.length >= 3, `${lesson.id} needs real instruction`);
    assert.ok(lesson.vocabulary.length >= 5 && lesson.practice.length >= 4 && lesson.questions.length >= 4, `${lesson.id} needs complete study tools`);
  }));
}
assert.ok(middletonLessonCount >= 3000, "The verified Middleton library should expose substantial lesson-level content, not empty cards");
assert.match(learning.lesson("ap-biology", "1", "1.1").overview, /Water is polar, forms hydrogen bonds/, "Representative AP lessons need course-specific factual instruction, not a generic shell");

const core = readFileSync(join(root, "assets/studyspace-core.js"), "utf8");
assert.match(core, /version:\s*3/, "Shared storage schema should be version 3");
assert.match(core, /function migrateV2/, "Shared storage should migrate existing version-1 progress");
assert.match(core, /function migrateV3/, "Shared storage should migrate existing version-2 progress");
assert.match(core, /mistakesFor/, "Shared storage should expose a mistake-review API");
assert.match(core, /markMistakeReviewed/, "Shared storage should expose mistake review status");
assert.match(core, /laterCorrected/, "Shared storage should preserve later-corrected status");

const courseLibraryClient = readFileSync(join(root, "assets/course-library.js"), "utf8");
const courseLibraryPage = readFileSync(join(root, "course-library.html"), "utf8");
assert.match(courseLibraryClient, /onboardingComplete:\s*false[\s\S]*selectedCourses:\s*\[\]/, "First-time users must begin with zero selected courses");
assert.doesNotMatch(courseLibraryClient, /const DEFAULTS/, "The dashboard must not silently restore the former eight default courses");
assert.match(courseLibraryClient, /LEGACY_KEY[\s\S]*onboardingComplete:\s*true/, "Existing explicit course selections need a backward-safe migration");
assert.match(courseLibraryPage, /data-grade-tab="9"[\s\S]*data-grade-tab="10"[\s\S]*data-grade-tab="11"[\s\S]*data-grade-tab="12"/, "Grade-first browsing must expose all four grade tabs");
assert.doesNotMatch(courseLibraryPage, /Verified|Availability year|Source Year|Verification Status/i, "The normal Course Library UI must not show verification or source-year labels");

const chatApi = readFileSync(join(root, "api/chat.js"), "utf8");
const chatClient = readFileSync(join(root, "assets/chatbot.js"), "utf8");
assert.ok(chatApi.includes('const MODEL="gemini-3.5-flash";'), "StudySpace AI should use regular Gemini 3.5 Flash");
assert.doesNotMatch(chatApi, /gemini-3\.5-flash-lite/, "The retired Lite model selection must not return");
assert.match(chatApi, /Never wrap variables, numbers, or equations in dollar signs/, "The tutor prompt should request plain-text math");
assert.ok(chatApi.includes('.replace(/\\$/g,"")'), "The API must remove stray dollar delimiters from model output");
assert.ok(chatClient.includes('.replace(/\\$/g,"")'), "The chat UI must clean both new and saved assistant messages");

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
const forbiddenClassNotes = /Class Notes|classNotes|class-notes|teacher notes|notes from class/i;
const uiSourceFiles = ["app.js", "assets/chatbot.js", "assets/course-runtime.js", "assets/course-framework-ui.js", "assets/data/course-frameworks.js", ...htmlFiles];
for (const file of uiSourceFiles) assert.doesNotMatch(readFileSync(join(root, file), "utf8"), forbiddenClassNotes, `${file} must not reintroduce the dedicated Class Notes UI`);

const requiredPages = [
  "manifest.webmanifest", "sw.js", "offline.html", "planner.html", "study.html",
  "aphg-topic.html", "aphg-material.html", "biology.html", "biology-topic.html",
  "biology-flashcards.html", "biology-quiz.html", "biology-mistakes.html",
  "biology-material.html", "biology-session.html", "algebra2.html", "algebra2-section.html",
  "algebra2-practice.html", "algebra2-flashcards.html", "algebra2-mistakes.html", "algebra2-session.html",
  "course-unit.html", "course-lesson.html", "course-flashcards.html", "course-quiz.html", "course-mistakes.html",
  "course-library.html", "assets/data/middleton-course-library.js", "assets/course-library.js"
];
for (const required of requiredPages) assert.ok(existsSync(join(root, required)), `${required} is required`);

console.log(`Validated ${verifiedMiddleton.length} verified Middleton courses, ${middletonLessonCount} library lessons, ${expectedCourses.length} preserved detailed courses, ${completeLessonCount} preserved framework lessons, ${unit.vocabulary.length} APHG vocabulary entries, ${questions.length} APHG questions, ${biology.unit1.sequences.length} Biology sequences, ${biologyQuestions.length} Biology questions, ${algebra.sections.length} Algebra sections, ${algebra.flashcards.length} Algebra cards, and ${htmlFiles.length} HTML pages.`);
