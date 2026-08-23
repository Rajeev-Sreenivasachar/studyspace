(function () {
  "use strict";
  const course = globalThis.BIOLOGY_COURSE;
  const app = globalThis.StudySpace;
  const id = new URLSearchParams(location.search).get("id");
  const material = course.material(id) || course.materials[0];
  const sequence = course.sequence(material.sequence);
  document.title = `${material.title} | StudySpace`;
  document.querySelector("#materialTitle").textContent = material.title;
  document.querySelector("#materialNote").textContent = material.note;
  document.querySelector("#materialMeta").innerHTML = `<span class="source-pill amsco">${app.escapeHtml(material.category)}</span><span class="source-pill">Sequence ${material.sequence}</span><span class="file-unavailable">Original file needed</span>`;
  document.querySelector("#materialStatus").innerHTML = `<strong>No source file is linked.</strong><p>Add an authorized file under <code>${app.escapeHtml(material.folder)}</code>, then update its material record. StudySpace will not open a temporary local path or claim the source was processed.</p>`;
  document.querySelector("#materialActions").innerHTML = ["View Source", "Study This Source", "Summarize Source", "Make Flashcards", "Quiz From Source"].map(action => `<button class="btn" type="button" disabled>${action}</button>`).join("");
})();
