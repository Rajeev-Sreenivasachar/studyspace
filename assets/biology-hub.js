(function () {
  "use strict";
  const course = globalThis.BIOLOGY_COURSE;
  const app = globalThis.StudySpace;
  const escape = app.escapeHtml;
  const mastery = app.allMastery(course.unit1);
  const measured = mastery.filter(item => item.score !== null);
  const average = measured.length ? Math.round(measured.reduce((sum, item) => sum + item.score, 0) / measured.length) : 0;
  document.querySelector("#biologyProgress").textContent = measured.length ? `${average}%` : "—";
  document.querySelector("#biologyStatusText").textContent = measured.length ? `${measured.length} of 5 sequences have enough evidence for a score.` : "No activity yet — start with any Unit 1 sequence.";

  document.querySelector("#biologyMastery").innerHTML = mastery.map(item => {
    const sequence = course.sequence(item.topic);
    const className = item.label.toLowerCase().replaceAll(" ", "-");
    return `<article class="biology-mastery-card ${className}" aria-label="${escape(item.topic)} ${escape(sequence.title)}: ${escape(item.label)}"><div class="mastery-top"><span>${escape(item.topic)}</span><strong>${item.score === null ? "—" : `${item.score}%`}</strong></div><h3>${escape(sequence.title)}</h3><p><span class="mastery-chip ${className}">${escape(item.label)}</span></p><div class="mastery-actions"><a href="biology-topic.html?t=${item.topic}">Learn</a><a href="biology-quiz.html?mode=topic&topic=${item.topic}">Practice</a></div></article>`;
  }).join("");

  const fullCourse = globalThis.STUDYSPACE_COURSES?.course("biology");
  document.querySelector("#biologyCourseMap").innerHTML = fullCourse.units.map(unit => `<section class="biology-unit available"><div class="biology-unit-head"><div><span class="eyebrow">Unit ${escape(unit.id)}</span><h2>${escape(unit.title)}</h2></div><span class="source-chip ${unit.id === "1" ? "teacher-class-material" : "studyspace-generated"}">${unit.id === "1" ? "Known class sequence" : "Complete original lessons"}</span></div><div class="biology-sequence-list">${unit.topics.map(sequence => `<a class="biology-sequence-row" href="${unit.id === "1" ? `biology-topic.html?t=${sequence.id}` : `course-lesson.html?c=biology&u=${encodeURIComponent(unit.id)}&l=${encodeURIComponent(sequence.id)}`}"><span>${escape(sequence.id)}</span><strong>${escape(sequence.title)}</strong><em>Open →</em></a>`).join("")}</div><p class="muted">${unit.id === "1" ? "Detailed 5E class-aligned StudySpace lessons; original teacher files are still labeled as not supplied." : "Florida-standards-backed scope with original StudySpace instruction, examples, vocabulary, practice, flashcards, and quizzes."}</p><a class="link" href="course-unit.html?c=biology&u=${encodeURIComponent(unit.id)}">Open unit overview →</a></section>`).join("");

  document.querySelector("#biologyMaterials").innerHTML = course.materials.map(material => `<section class="material-group"><h3>${escape(material.sequence)} ${escape(course.sequence(material.sequence).title)}</h3><div class="material-list"><a class="material-row" href="biology-material.html?id=${material.id}"><span class="material-icon">＋</span><span><strong>${escape(material.category)}</strong><small>Original file needed · ${escape(material.folder)}</small></span><span>Open →</span></a></div></section>`).join("");
})();
