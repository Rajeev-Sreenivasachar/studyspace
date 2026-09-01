(function () {
  "use strict";
  const app = globalThis.StudySpace;
  const form = document.querySelector("#importForm");
  const fileInput = document.querySelector("#importFile");
  const message = document.querySelector("#importMessage");
  let imageFile = null;
  const escape = value => app.escapeHtml(value);

  function populateSubjects() {
    const select = document.querySelector("#importSubject");
    const setup = (() => { try { return JSON.parse(localStorage.getItem("studyspace-course-setup-v2")); } catch { return null; } })();
    const selected = new Set(setup?.selectedCourses || []);
    const courses = (globalThis.STUDYSPACE_COURSES?.list?.() || []).filter(course => !selected.size || selected.has(course.id));
    select.innerHTML = `${courses.map(course => `<option value="${escape(course.id)}">${escape(course.title)}</option>`).join("")}<option value="General">General</option>`;
  }

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

  document.querySelector("#exportBackup").onclick = () => {
    const blob = new Blob([app.exportBackup()], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); link.download = `studyspace-backup-${new Date().toISOString().slice(0,10)}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    document.querySelector("#backupMessage").textContent = "Backup downloaded. Keep it private because it contains your local study data.";
  };
  document.querySelector("#importBackup").onchange = event => {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { app.importBackup(String(reader.result || "")); document.querySelector("#backupMessage").textContent = "Backup restored. Reloading…"; setTimeout(() => location.reload(), 500); } catch (error) { document.querySelector("#backupMessage").textContent = error.message; } };
    reader.readAsText(file);
  };
  window.addEventListener("studyspace:data", renderSets);
  populateSubjects();
  renderSets();
})();
