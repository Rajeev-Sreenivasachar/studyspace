(function () {
  "use strict";
  const app = globalThis.StudySpace;
  const form = document.querySelector("#importForm");
  const fileInput = document.querySelector("#importFile");
  const message = document.querySelector("#importMessage");
  let imageFile = null;
  const escape = value => app.escapeHtml(value);

  fileInput.onchange = () => {
    const file = fileInput.files?.[0];
    imageFile = null;
    if (!file) return;
    document.querySelector("#importFileName").textContent = file.name;
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => { document.querySelector("#importText").value = String(reader.result || "").slice(0, 12000); };
      reader.readAsText(file);
    } else if (["image/png", "image/jpeg", "image/webp"].includes(file.type)) imageFile = file;
    else message.textContent = "That file type is not supported here. Use TXT, PNG, JPEG, or WebP.";
  };

  function payload() {
    return { subject: document.querySelector("#importSubject").value, unit: document.querySelector("#importUnit").value || "Unsorted", title: document.querySelector("#importTitleInput").value, sourceType: imageFile ? "scanned-image" : "pasted-text", sourceLabel: imageFile ? imageFile.name : "Student-provided text", originalText: document.querySelector("#importText").value };
  }

  form.onsubmit = event => {
    event.preventDefault();
    message.textContent = "";
    const input = payload();
    if (!input.originalText.trim() && !imageFile) return void (message.textContent = "Paste text or choose a supported scan image first.");
    const set = app.saveStudySet(input);
    renderSets();
    if (imageFile) {
      window.dispatchEvent(new CustomEvent("studyspace:attach-image", { detail: { file: imageFile, prompt: `Read this source for ${set.subject} → ${set.unit}. Keep source content separate from additional explanation. Help me create a study set.` } }));
    } else {
      app.studyThis({ title: set.title, text: set.originalText, source: `${set.sourceLabel} · ${set.subject} · ${set.unit}` });
    }
  };

  document.querySelector("#scanWithAi").onclick = () => {
    if (imageFile) window.dispatchEvent(new CustomEvent("studyspace:attach-image", { detail: { file: imageFile, prompt: "Read this scanned source. Identify what is actually visible, keep source facts separate from extra explanation, and ask what study set I want to create." } }));
    else app.openAI("I want to scan a worksheet. Tell me to use the paperclip image upload and explain that supported images are PNG, JPEG, or WebP.", false);
  };

  function renderSets() {
    const sets = app.state.studySets.slice().reverse();
    document.querySelector("#savedSets").innerHTML = sets.length ? sets.map(set => `<article class="saved-set"><div><div class="eyebrow">${escape(set.subject)} · ${escape(set.unit)}</div><h3>${escape(set.title)}</h3><p>${escape(set.sourceLabel)} · ${new Date(set.updatedAt).toLocaleDateString()}</p></div><div class="saved-set-actions"><button type="button" data-study-set="${set.id}">Study This</button><button type="button" data-ask-set="${set.id}">Ask AI</button><button type="button" data-delete-set="${set.id}">Delete</button></div></article>`).join("") : `<div class="empty-state panel"><h3>No saved study sets yet</h3><p class="muted">Paste source material above to create one.</p></div>`;
    document.querySelectorAll("[data-study-set]").forEach(button => button.onclick = () => { const set = app.state.studySets.find(item => item.id === button.dataset.studySet); if (set) app.studyThis({ title: set.title, text: set.originalText, source: `${set.sourceLabel} · ${set.subject} · ${set.unit}` }); });
    document.querySelectorAll("[data-ask-set]").forEach(button => button.onclick = () => { const set = app.state.studySets.find(item => item.id === button.dataset.askSet); if (set) app.openAI(`Use this saved SOURCE MATERIAL and clearly label additional explanation:\n\n${set.originalText.slice(0, 2600)}`); });
    document.querySelectorAll("[data-delete-set]").forEach(button => button.onclick = () => app.update(data => { data.studySets = data.studySets.filter(item => item.id !== button.dataset.deleteSet); }));
  }

  function renderNotes() {
    const notes = app.state.notes.slice().reverse();
    document.querySelector("#savedNotes").innerHTML = notes.length ? notes.map(note => `<article class="saved-note"><h3>${escape(note.title)}</h3><p>${escape(note.text.slice(0, 240))}${note.text.length > 240 ? "…" : ""}</p><div><button type="button" data-note-action="Summarize" data-note="${note.id}">Summarize</button><button type="button" data-note-action="Clean Up" data-note="${note.id}">Clean Up</button><button type="button" data-note-action="Explain" data-note="${note.id}">Explain</button><button type="button" data-note-action="Make Flashcards" data-note="${note.id}">Flashcards</button><button type="button" data-note-action="Quiz Me" data-note="${note.id}">Quiz Me</button></div></article>`).join("") : `<p class="muted">Saved notes will appear here.</p>`;
    document.querySelectorAll("[data-note-action]").forEach(button => button.onclick = () => {
      const note = app.state.notes.find(item => item.id === button.dataset.note);
      if (note) app.openAI(`${button.dataset.noteAction} these student notes. Preserve the ORIGINAL NOTES and provide any changes as a separate suggestion:\n\n${note.text.slice(0, 2600)}`);
    });
  }

  document.querySelector("#noteForm").onsubmit = event => {
    event.preventDefault();
    const note = { id: `note-${Date.now()}`, title: document.querySelector("#noteTitle").value, text: document.querySelector("#noteText").value, createdAt: new Date().toISOString() };
    app.update(data => data.notes.push(note));
    event.target.reset();
  };
  window.addEventListener("studyspace:data", () => { renderSets(); renderNotes(); });
  renderSets();
  renderNotes();
})();
