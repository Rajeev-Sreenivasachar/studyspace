(function () {
  "use strict";
  const unit = globalThis.APHG_UNIT1;
  const app = globalThis.StudySpace;
  const id = new URLSearchParams(location.search).get("id") || "teacher-1-1";
  const material = unit.material(id) || unit.materials[0];
  const escape = value => app.escapeHtml(value);
  const topic = unit.topic(material.topic);
  const sourceNotes = topic ? topic.notes.filter(note => note.source === material.source) : [];
  const sourceText = sourceNotes.map(note => `${note.heading}: ${note.body}`).join("\n");
  const usable = material.status === "transcribed" && sourceText;

  document.title = `${material.title} | StudySpace`;
  document.querySelector("#materialGroup").textContent = material.group;
  document.querySelector("#materialTitle").innerHTML = `<span class="gradient-text">${escape(material.title)}</span>`;
  document.querySelector("#materialSummary").textContent = material.summary;
  document.querySelector("#materialMeta").innerHTML = `<span class="source-chip ${material.source}">Priority ${unit.sources[material.source]?.priority || "—"}: ${escape(unit.sourceLabel(material.source))}</span><span class="source-chip ${material.status === "transcribed" ? "teacher" : "pending"}">${material.status === "transcribed" ? "Verified transcription" : "Original file needed"}</span>`;
  document.querySelector("#materialFileAction").innerHTML = material.originalPath ? `<a class="btn primary" href="${escape(material.originalPath)}" target="_blank" rel="noopener">Open original file</a>` : `<span class="file-unavailable">Original file not supplied — no temporary local link shown</span>`;

  if (usable) {
    document.querySelector("#sourceReader").innerHTML = sourceNotes.map(note => `<article><div class="eyebrow">Verified source material</div><h3>${escape(note.heading)}</h3><p>${escape(note.body)}</p></article>`).join("");
  } else {
    document.querySelector("#sourceReader").innerHTML = `<div class="source-notice"><strong>This source record is ready, but its original content is unavailable.</strong><p>${escape(material.fileNote)}</p><p>Add the authorized file under <code>/assets/materials/aphg/unit1/</code>, then set its repository path in the source manifest. StudySpace will never claim a missing reading was processed.</p></div>`;
  }

  const actions = [
    ["Study This", "Study This"], ["Ask StudySpace AI", "Ask"], ["Generate Flashcards", "Flashcards"], ["Generate Quiz", "Quiz"], ["Summarize", "Summary"], ["Find Important Vocabulary", "Vocabulary"]
  ];
  document.querySelector("#sourceActions").innerHTML = actions.map(([label, action]) => `<button class="btn ${action === "Study This" ? "primary" : ""}" type="button" data-source-action="${action}" ${usable ? "" : "disabled"}>${label}</button>`).join("");
  document.querySelectorAll("[data-source-action]").forEach(button => button.onclick = () => {
    const action = button.dataset.sourceAction;
    if (action === "Study This") return app.studyThis({ title: material.title, text: sourceText, source: `${unit.sourceLabel(material.source)} — verified transcription` });
    app.openAI(`${action.toUpperCase()}\nSelected source: ${material.title}\nThis is SOURCE MATERIAL from ${unit.sourceLabel(material.source)}. Prioritize it. Clearly label anything you add that is not contained here.\n\n${sourceText}`);
  });
})();
