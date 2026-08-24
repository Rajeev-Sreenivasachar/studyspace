(function () {
  "use strict";
  const data = globalThis.ALGEBRA2_CHAPTER1;
  const app = globalThis.StudySpace;
  const escape = app.escapeHtml;
  const mastery = app.allMastery(data.chapter1);
  const measured = mastery.filter(item => item.score !== null);
  const average = measured.length ? Math.round(measured.reduce((sum, item) => sum + item.score, 0) / measured.length) : null;

  document.querySelector("#chapterScore").textContent = average === null ? "—" : `${average}%`;
  document.querySelector("#chapterStatus").textContent = measured.length ? `${measured.length} of 6 sections have enough evidence for a measured score.` : "No activity yet. Your progress appears after repeated practice.";
  document.querySelector("#algebraSections").innerHTML = mastery.map(item => {
    const section = data.section(item.topic);
    const cls = item.label.toLowerCase().replaceAll(" ", "-");
    return `<article class="algebra-section-card ${cls}"><div class="mastery-top"><span>Section ${escape(section.id)}</span><strong>${item.score === null ? "—" : `${item.score}%`}</strong></div><h3>${escape(section.title)}</h3><p>${escape(section.description)}</p><div class="skill-pills">${section.skills.slice(0, 3).map(skill => `<span>${escape(skill.title)}</span>`).join("")}</div><p><span class="mastery-chip ${cls}">${escape(item.label)}</span></p><div class="mastery-actions"><a href="algebra2-section.html?s=${section.id}">Learn</a><a href="algebra2-practice.html?section=${section.id}">Practice</a></div></article>`;
  }).join("");

  const allSkills = data.sections.flatMap(section => section.skills.map(skill => ({ ...app.conceptMastery("algebra2", skill.title), section, skill })));
  const measuredSkills = allSkills.filter(item => item.score !== null).sort((a, b) => a.score - b.score);
  const next = measuredSkills[0]?.section || data.sections.find(section => app.topicMastery(section.id, data.chapter1).evidence < 3) || data.sections[0];
  const reason = measuredSkills[0] ? `${measuredSkills[0].skill.title} is your lowest measured skill at ${measuredSkills[0].score}%.` : `Build evidence in ${next.id} with a visual lesson and a Try It problem.`;
  document.querySelector("#continueTitle").textContent = `${next.id} ${next.title}`;
  document.querySelector("#continueReason").textContent = reason;
  document.querySelector("#continueLink").href = `algebra2-section.html?s=${next.id}`;
  document.querySelector("#continueAlgebra").href = `algebra2-section.html?s=${next.id}`;
  document.querySelector("#continueAlgebra").textContent = measured.length ? "Continue Chapter 1" : "Start Chapter 1";

  document.querySelector("#weakSkills").innerHTML = measuredSkills.length ? measuredSkills.slice(0, 4).map(item => `<a class="weak-skill-row" href="algebra2-practice.html?mode=weak&section=${item.section.id}"><span>${escape(item.section.id)} · ${escape(item.skill.title)}</span><strong>${item.score}%</strong></a>`).join("") : `<p class="muted">Complete practice to find weak skills.</p>`;
  const mistakes = app.mistakesFor("algebra2").slice(0, 3);
  document.querySelector("#recentAlgebraMistakes").innerHTML = mistakes.length ? mistakes.map(item => `<p class="mistake-preview"><strong>${escape(item.topic)} · ${escape(item.concept)}</strong><span>${escape(item.mistakeCategory || "Review this idea")}</span></p>`).join("") : `<p class="muted">No saved Algebra 2 mistakes.</p>`;
  document.querySelector("#algebraAi").onclick = () => app.openAI(`Tutor Mode: Help me study Algebra 2 Chapter 1. My recommended next section is ${next.id} ${next.title}. Ask what I want to work on, then teach with one visual or numeric example and one check question.`);
})();
