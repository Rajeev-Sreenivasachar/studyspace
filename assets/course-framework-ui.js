(function () {
  "use strict";
  const escape = value => String(value ?? "").replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  const sourceBadge = source => `<span class="source-chip ${escape(source.type)}">${source.type === "official-framework" ? "Official" : source.type === "teacher-class-material" ? "Class" : "StudySpace"}</span>`;
  const detailed = (course, item) => course.id === "aphg" && item.id === "1" ? { unit: "aphg.html", lesson: id => `aphg-topic.html?t=${encodeURIComponent(id)}`, quiz: "aphg-quiz.html", cards: "aphg-flashcards.html" } : course.id === "algebra2" && item.id === "class-1" ? { unit: "algebra2.html", lesson: id => `algebra2-section.html?s=${encodeURIComponent(id)}`, quiz: "algebra2-practice.html?mode=mixed", cards: "algebra2-flashcards.html" } : course.id === "biology" && item.id === "1" ? { unit: "biology.html", lesson: id => `biology-topic.html?t=${encodeURIComponent(id)}`, quiz: "biology-quiz.html", cards: "biology-flashcards.html" } : course.id === "csit-essentials" && item.id === "1" ? { unit: "csit-module1.html", lesson: () => "csit-module1.html", quiz: "csit-module1-quiz.html", cards: "csit-module1-flashcards.html" } : null;

  function renderSources(course) {
    return course.sources.map(source => `<article class="framework-source ${escape(source.type)}">
      <div>${sourceBadge(source)}<strong>${escape(source.label)}</strong></div>
      <p>${escape(source.scope)}</p>
      <small>${escape(source.authority)} · ${escape(source.version)} · Priority ${source.priority}</small>
      ${source.url ? `<a class="link" href="${escape(source.url)}" target="_blank" rel="noopener">Open official source ↗</a>` : `<span class="muted">${source.status === "needed" || source.status === "structure-known-files-needed" ? "Class material not supplied yet" : "Internal source record"}</span>`}
    </article>`).join("");
  }

  function renderUnit(course, item, index) {
    const classLabel = item.classSequence ? `<span class="badge class-order">Class sequence</span>` : "";
    const status = item.status === "class-content-available" ? "Detailed class content + complete tools" : item.status === "needs-class-info" ? "Needs class information" : "Complete original lessons + official scope";
    const preferred = detailed(course, item);
    const openUnit = preferred?.unit || `course-unit.html?c=${encodeURIComponent(course.id)}&u=${encodeURIComponent(item.id)}`;
    const openQuiz = preferred?.quiz || `course-quiz.html?c=${encodeURIComponent(course.id)}&u=${encodeURIComponent(item.id)}`;
    const openCards = preferred?.cards || `course-flashcards.html?c=${encodeURIComponent(course.id)}&u=${encodeURIComponent(item.id)}`;
    return `<details class="framework-unit ${escape(item.status)}" ${index === 0 ? "open" : ""}>
      <summary><span class="framework-number">${escape(item.id)}</span><span><strong>${escape(item.title)}</strong><small>${escape(status)}</small></span>${classLabel}<span class="framework-chevron" aria-hidden="true">⌄</span></summary>
      <div class="framework-unit-body"><p>${escape(item.summary)}</p><div class="framework-actions"><a class="btn primary small" href="${openUnit}">Open complete unit →</a><a class="btn small" href="${openQuiz}">Practice unit</a><a class="btn small" href="${openCards}">Flashcards</a></div>${item.note ? `<p class="source-line">${escape(item.note)}</p>` : ""}
        ${item.requiredKnowledge?.length ? `<div class="framework-knowledge"><strong>Required knowledge checkpoints</strong><ul>${item.requiredKnowledge.map(point => `<li>${escape(point)}</li>`).join("")}</ul></div>` : ""}
        <div class="framework-topics">${item.topics.map(entry => {
          const sources = entry.sourceIds.map(id => globalThis.STUDYSPACE_COURSES.findSource(course, id)).filter(Boolean);
          const openLesson = preferred?.lesson(entry.id) || `course-lesson.html?c=${encodeURIComponent(course.id)}&u=${encodeURIComponent(item.id)}&l=${encodeURIComponent(entry.id)}`;
          return `<a href="${openLesson}"><div><span>${escape(entry.id)}</span><strong>${escape(entry.title)}</strong></div><p>${escape(entry.summary)}</p><div class="topic-provenance">${sources.map(sourceBadge).join("")}</div><b class="link">Open lesson →</b></a>`;
        }).join("")}</div>
        ${item.practice ? `<details class="framework-practice"><summary>Try an original AP-style question</summary><p><strong>${escape(item.practice.prompt)}</strong></p><ol type="A">${item.practice.choices.map(choice => `<li>${escape(choice)}</li>`).join("")}</ol><details><summary>Check answer</summary><p><b>${escape(item.practice.answer)}</b> — ${escape(item.practice.explanation)}</p></details><small>Original StudySpace practice aligned to the official framework; not a College Board or teacher question.</small></details>` : ""}
      </div>
    </details>`;
  }

  function render(target) {
    const key = target.dataset.courseFramework;
    const catalog = globalThis.STUDYSPACE_COURSES;
    const course = catalog?.course(key);
    if (!course) { target.innerHTML = `<p class="source-notice">Course framework is not available.</p>`; return; }
    const warning = course.frameworkStatus === "needs-class-identification" ? `<div class="framework-warning"><strong>Exact course-code mapping is still pending.</strong><p>The original foundation lessons are usable now. Add the syllabus or course number to connect precise Florida benchmarks and teacher order without pretending this course is Cisco IT Essentials.</p></div>` : "";
    target.innerHTML = `<div class="section-head framework-heading"><div><div class="eyebrow">Full-year course backbone</div><h2>${escape(course.title)} course map</h2><p>${escape(course.summary)}</p></div><span class="badge">${course.units.length} ${course.units.length === 1 ? "area" : "units / strands"}</span></div>
      ${warning}
      <div class="framework-priority" aria-label="Source priority"><span><b>1</b> Official framework</span><i>→</i><span><b>2</b> Teacher/class materials</span><i>→</i><span><b>3</b> Original StudySpace content</span></div>
      <div class="framework-actions"><button class="btn small" type="button" data-expand-framework>Expand all</button><button class="btn small" type="button" data-collapse-framework>Collapse all</button><button class="btn primary small" type="button" data-study-framework>Ask AI about this course</button></div>
      <div class="framework-units">${course.units.map((item, index) => renderUnit(course, item, index)).join("")}</div>
      <section class="framework-sources" aria-label="Course framework sources"><div class="section-head"><div><h3>Source registry</h3><p>Every course-map item points to official, class, or original StudySpace provenance.</p></div></div><div class="framework-source-grid">${renderSources(course)}</div><p class="source-footnote">Official frameworks define what belongs in the course. Teacher materials can change the class order. StudySpace explanations and practice are original and never presented as teacher content.</p></section>`;
    target.querySelector("[data-expand-framework]").onclick = () => target.querySelectorAll("details").forEach(details => { details.open = true; });
    target.querySelector("[data-collapse-framework]").onclick = () => target.querySelectorAll("details").forEach(details => { details.open = false; });
    target.querySelector("[data-study-framework]").onclick = () => {
      const prompt = `Help me study ${course.title}. Use this official-framework course map as the backbone, keep teacher/class material separate, and label any added explanation as StudySpace-generated. Ask which unit I want to study.\n\n${course.units.map(item => `${item.id} ${item.title}: ${item.topics.map(entry => entry.title).join(", ")}`).join("\n")}`;
      if (globalThis.StudySpace?.openAI) StudySpace.openAI(prompt);
      else document.querySelector(".ssai-toggle")?.click();
    };
  }

  function boot() { document.querySelectorAll("[data-course-framework]").forEach(render); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
