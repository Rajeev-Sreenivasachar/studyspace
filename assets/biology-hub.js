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

  document.querySelector("#biologyCourseMap").innerHTML = course.units.map(unit => `<section class="biology-unit ${unit.status === "available" ? "available" : "placeholder"}"><div class="biology-unit-head"><div><span class="eyebrow">${escape(unit.title)}</span><h2>${unit.id === "1" ? "Foundations of Life" : unit.title}</h2></div><span class="source-chip ${unit.status === "available" ? "teacher" : "pending"}">${unit.status === "available" ? "Detailed outline available" : "Material not imported yet"}</span></div><div class="biology-sequence-list">${unit.sequences.map(sequence => unit.status === "available" ? `<a class="biology-sequence-row" href="biology-topic.html?t=${sequence.id}"><span>${escape(sequence.id)}</span><strong>${escape(sequence.title)}</strong><em>Open →</em></a>` : `<article class="biology-sequence-row disabled"><span>${escape(sequence.id)}</span><strong>${escape(sequence.title)}</strong><em>Source needed</em></article>`).join("")}</div>${unit.status === "available" ? "" : `<p class="muted">This course position is reserved. StudySpace will not invent teacher-specific notes before the source material is imported.</p>`}</section>`).join("");

  document.querySelector("#biologyMaterials").innerHTML = course.materials.map(material => `<section class="material-group"><h3>${escape(material.sequence)} ${escape(course.sequence(material.sequence).title)}</h3><div class="material-list"><a class="material-row" href="biology-material.html?id=${material.id}"><span class="material-icon">＋</span><span><strong>${escape(material.category)}</strong><small>Original file needed · ${escape(material.folder)}</small></span><span>Open →</span></a></div></section>`).join("");
})();
