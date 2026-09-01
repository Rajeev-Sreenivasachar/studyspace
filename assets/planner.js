(function () {
  "use strict";
  const app = globalThis.StudySpace;
  const form = document.querySelector("#assessmentForm");
  const escape = value => app.escapeHtml(value);

  function populateCourses() {
    const select = document.querySelector("#assessmentSubject");
    const setup = (() => { try { return JSON.parse(localStorage.getItem("studyspace-course-setup-v2")); } catch { return null; } })();
    const selected = new Set(setup?.selectedCourses || []);
    const all = globalThis.MIDDLETON_COURSE_LIBRARY?.list?.() || globalThis.STUDYSPACE_COURSES?.list?.() || [];
    const courses = all.filter(course => !selected.size || selected.has(course.id));
    select.innerHTML = courses.map(course => `<option value="${escape(course.id)}">${escape(course.title)}</option>`).join("") || `<option value="General">General</option>`;
  }

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
    renderWeeklyReview();
  }

  function renderWeeklyReview() {
    const review = app.weeklyReview();
    document.querySelector("#weeklyReviewGrid").innerHTML = [
      [review.minutes, "focus minutes"], [review.questions, "questions answered"], [review.accuracy === null ? "—" : `${review.accuracy}%`, "practice accuracy"], [review.corrected, "mistakes corrected"], [review.due, "reviews due"]
    ].map(([value, label]) => `<article><strong>${escape(value)}</strong><span>${escape(label)}</span></article>`).join("");
  }

  function renderPlans(items) {
    document.querySelector("#generatedPlans").innerHTML = items.length ? items.map(item => {
      const plan = app.generatePlan(item, item.subject === "aphg" ? APHG_UNIT1 : undefined);
      return `<article class="plan-card"><div class="plan-card-head"><div><div class="eyebrow">${escape(item.name)}</div><h3>${escape(app.countdown(item.date))}</h3></div><span>${plan.reduce((sum, task) => sum + task.minutes, 0)} min total</span></div><div class="plan-days">${plan.map(task => `<div class="plan-day ${task.complete ? "complete" : ""}"><label><input type="checkbox" data-task="${task.id}" ${task.complete ? "checked" : ""}><span><strong>${escape(task.day)} — ${task.minutes} min</strong><b>${escape(task.title)}</b><small>${escape(task.actions.join(" · "))}</small></span></label><a href="index.html?focusTask=${encodeURIComponent(task.title)}#focus" data-focus-task="${escape(task.title)}">Start Focus Session</a></div>`).join("")}</div></article>`;
    }).join("") : "";
    document.querySelectorAll("[data-task]").forEach(input => {
      input.onchange = () => {
        const item = items.find(assessment => input.dataset.task.startsWith(`plan-${assessment.id}-`));
        if (!item) return;
        const plan = app.generatePlan(item, item.subject === "aphg" ? APHG_UNIT1 : undefined);
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
    const subjectSelect = document.querySelector("#assessmentSubject");
    if (![...subjectSelect.options].some(option => option.value === item.subject)) subjectSelect.add(new Option(item.subject, item.subject));
    subjectSelect.value = item.subject;
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
  populateCourses();
  renderAssessments();
})();
