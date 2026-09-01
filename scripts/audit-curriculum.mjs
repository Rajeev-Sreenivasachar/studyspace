import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const file of ["assets/data/course-frameworks.js", "assets/data/middleton-course-library.js", "assets/data/full-course-content.js"]) await import(pathToFileURL(join(root, file)).href);

const courses = Object.values(globalThis.STUDYSPACE_COURSES.courses);
const errors = [];
const warnings = [];
const seenCourseIds = new Set();
let unitCount = 0, topicCount = 0, questionCount = 0;

for (const course of courses) {
  if (seenCourseIds.has(course.id)) errors.push(`Duplicate course id: ${course.id}`);
  seenCourseIds.add(course.id);
  const sourceIds = new Set(course.sources.map(source => source.id));
  const seenUnits = new Set();
  for (const unit of course.units) {
    unitCount += 1;
    if (seenUnits.has(unit.id)) errors.push(`${course.id}: duplicate unit id ${unit.id}`);
    seenUnits.add(unit.id);
    if (!unit.contentStatus) errors.push(`${course.id}/${unit.id}: missing contentStatus`);
    unit.sourceIds.forEach(id => { if (!sourceIds.has(id)) errors.push(`${course.id}/${unit.id}: unknown source ${id}`); });
    const seenTopics = new Set();
    for (const topic of unit.topics) {
      topicCount += 1;
      if (seenTopics.has(topic.id)) errors.push(`${course.id}/${unit.id}: duplicate topic id ${topic.id}`);
      seenTopics.add(topic.id);
      if (!topic.title || !topic.summary) errors.push(`${course.id}/${unit.id}/${topic.id}: missing title or summary`);
      if (!topic.contentStatus) errors.push(`${course.id}/${unit.id}/${topic.id}: missing contentStatus`);
      for (const field of ["dependsOn", "supports", "relatedConcepts"]) if (!Array.isArray(topic[field])) errors.push(`${course.id}/${unit.id}/${topic.id}: ${field} must be an array`);
      topic.sourceIds.forEach(id => { if (!sourceIds.has(id)) errors.push(`${course.id}/${unit.id}/${topic.id}: unknown source ${id}`); });
      const lesson = globalThis.STUDYSPACE_LEARNING.lesson(course.id, unit.id, topic.id);
      if (!lesson) errors.push(`${course.id}/${unit.id}/${topic.id}: missing learning record`);
      else for (const question of lesson.questions) {
        questionCount += 1;
        if (!question.id || !question.prompt || question.choices.length !== 4) errors.push(`${course.id}/${unit.id}/${topic.id}: malformed question`);
        if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.choices.length) errors.push(`${question.id}: invalid answer index`);
        for (const field of ["difficulty", "cognitiveType", "misconception", "provenance", "version"]) if (question[field] == null) errors.push(`${question.id}: missing ${field}`);
      }
    }
    for (const topic of unit.topics) for (const dependency of topic.dependsOn || []) {
      const exists = course.units.some(candidate => candidate.topics.some(item => item.id === dependency));
      if (!exists) warnings.push(`${course.id}/${topic.id}: prerequisite ${dependency} is outside the current course map`);
    }
  }
}

if (errors.length) {
  console.error(`Curriculum audit failed with ${errors.length} error(s):`);
  errors.slice(0, 100).forEach(error => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Curriculum audit passed: ${courses.length} detailed courses, ${unitCount} units, ${topicCount} topics, and ${questionCount} validated questions.`);
  if (warnings.length) console.log(`${warnings.length} prerequisite note(s) remain for concepts intentionally mapped outside the local detailed course.`);
}
