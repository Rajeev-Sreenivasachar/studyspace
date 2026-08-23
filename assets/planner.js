(function () {
  "use strict";
  const app = globalThis.StudySpace;
  const form = document.querySelector("#assessmentForm");
  const escape = value => app.escapeHtml(value);

  function assessments() {
    return app.state.assessments.filter(item => (app.daysUntil(item.date) ?? -1) >= 0).sort((a, b) => a.date.localeCompare(b.date));
  }

  function renderAssessments() {
    const items = assessments();
    document.querySelector("#assessmentList").innerHTML = items.length ? items.map(item => `<article class="assessment-card"><div class="assessment-date"><strong>${escape(new Date(`${item.date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" }))}</strong><span>${escape(app.countdown(item.date))}</span></div><div><div class="eyebrow">${escape(item.subject)} · ${escape(item.type)}</div><h3>${escape(item.name)}</h3><p>${escape(item.topics || "No topics listed")}</p>${item.notes ? `<small>${escape(item.notes)}</small>` : ""}</div><div class="assessment-actions"><button type="button" data-edit="${item.id}">Edit</button><button type="button" data-delete="${item.id}">Delete</button></div></article>`).join("") : `<div class="empty-state panel"><h3>No upcoming assessments</h3><p class="muted">Add a quiz, test, assignment, or project to generate a study plan.</p></div>`;
    document.querySelectorAll("[data-edit]").forEach(button => button.onclick = () => edit(button.dataset.edit));
    document.querySelectorAll("[data-delete]").forEach(button => button.onclick = () => {
      const item = app.state.assessments.find(assessment => assessment.id === button.dataset.delete);
      if (item && confirm(`Delete ${item.name}?`)) app.deleteAssessment(item.id);
    });
    renderPlans(items);
  }

  function genericPlan(item) {
    const days = Math.max(0, app.daysUntil(item.date) ?? 0);
    const labels = days === 0 ? ["Today"] : days === 1 ? ["Today", "Tomorrow"] : ["Today", "Next session", "Night before"];
    return labels.map((day, index) => ({ id: `plan-${item.id}-${index}`, assessmentId: item.id, day, minutes: index === labels.length - 1 ? 20 : 15, title: index === labels.length - 1 ? "Final review" : `Review ${item.topics || item.name}`, actions: index === labels.length - 1 ? ["Review unfinished material", "Practice without notes", "Check mistakes"] : ["Review key notes", "Study a small flashcard set", "Answer practice questions"], complete: app.state.planTasks.find(task => task.id === `plan-${item.id}-${index}`)?.complete || false }));
  }

  function renderPlans(items) {
    document.querySelector("#generatedPlans").innerHTML = items.length ? items.map(item => {
      const plan = item.subject === "AP Human Geography" ? app.generatePlan(item, APHG_UNIT1) : genericPlan(item);
      return `<article class="plan-card"><div class="plan-card-head"><div><div class="eyebrow">${escape(item.name)}</div><h3>${escape(app.countdown(item.date))}</h3></div><span>${plan.reduce((sum, task) => sum + task.minutes, 0)} min total</span></div><div class="plan-days">${plan.map(task => `<div class="plan-day ${task.complete ? "complete" : ""}"><label><input type="checkbox" data-task="${task.id}" ${task.complete ? "checked" : ""}><span><strong>${escape(task.day)} — ${task.minutes} min</strong><b>${escape(task.title)}</b><small>${escape(task.actions.join(" · "))}</small></span></label><a href="index.html?focusTask=${encodeURIComponent(task.title)}#focus" data-focus-task="${escape(task.title)}">Start Focus Session</a></div>`).join("")}</div></article>`;
    }).join("") : "";
    document.querySelectorAll("[data-task]").forEach(input => {
      input.onchange = () => {
        const item = items.find(assessment => input.dataset.task.startsWith(`plan-${assessment.id}-`));
        if (!item) return;
        const plan = item.subject === "AP Human Geography" ? app.generatePlan(item, APHG_UNIT1) : genericPlan(item);
        const task = plan.find(candidate => candidate.id === input.dataset.task);
        if (task) app.setTaskComplete(task, input.checked);
      };
    });
    document.querySelectorAll("[data-focus-task]").forEach(link => link.onclick = () => sessionStorage.setItem("studyspace-focus-task", link.dataset.focusTask));
  }

  function edit(id) {
    const item = app.state.assessments.find(assessment => assessment.id === id);
    if (!item) return;
    document.querySelector("#assessmentId").value = item.id;
    document.querySelector("#assessmentName").value = item.name;
    document.querySelector("#assessmentSubject").value = item.subject;
    document.querySelector("#assessmentDate").value = item.date;
    document.querySelector("#assessmentType").value = item.type;
    document.querySelector("#assessmentTopics").value = item.topics;
    document.querySelector("#assessmentNotes").value = item.notes;
    document.querySelector("#saveAssessment").textContent = "Save changes";
    document.querySelector("#cancelEdit").hidden = false;
    form.scrollIntoView({ behavior: "smooth" });
  }

  function resetForm() {
    form.reset();
    document.querySelector("#assessmentId").value = "";
    document.querySelector("#saveAssessment").textContent = "Add assessment";
    document.querySelector("#cancelEdit").hidden = true;
  }

  form.onsubmit = event => {
    event.preventDefault();
    app.addAssessment({ id: document.querySelector("#assessmentId").value || undefined, name: document.querySelector("#assessmentName").value, subject: document.querySelector("#assessmentSubject").value, date: document.querySelector("#assessmentDate").value, type: document.querySelector("#assessmentType").value, topics: document.querySelector("#assessmentTopics").value, notes: document.querySelector("#assessmentNotes").value });
    resetForm();
  };
  document.querySelector("#cancelEdit").onclick = resetForm;
  window.addEventListener("studyspace:data", renderAssessments);
  renderAssessments();
})();
