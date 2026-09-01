(function () {
  "use strict";
  const STATE_KEY = "studyspace-course-setup-v2";
  const LEGACY_KEY = "studyspace-my-courses-v1";
  const library = globalThis.MIDDLETON_COURSE_LIBRARY;
  if (!library) return;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const validIds = ids => [...new Set((Array.isArray(ids) ? ids : []).filter(id => library.course(id)))];
  const blankState = () => ({ version: 2, onboardingComplete: false, studentGrade: "", selectedCourses: [] });
  const countLabel = count => `${count} course${count === 1 ? "" : "s"}`;
  const gradeLabel = grade => `${grade}th Grade`;

  function normalize(candidate) {
    return {
      version: 2,
      onboardingComplete: candidate?.onboardingComplete === true,
      studentGrade: ["9", "10", "11", "12"].includes(String(candidate?.studentGrade || "")) ? String(candidate.studentGrade) : "",
      selectedCourses: validIds(candidate?.selectedCourses)
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STATE_KEY));
      if (saved && typeof saved === "object") return normalize(saved);
    } catch {}
    try {
      const legacyText = localStorage.getItem(LEGACY_KEY);
      if (legacyText !== null) {
        const legacy = JSON.parse(legacyText);
        if (Array.isArray(legacy)) {
          const migrated = normalize({ onboardingComplete: true, selectedCourses: legacy });
          localStorage.setItem(STATE_KEY, JSON.stringify(migrated));
          return migrated;
        }
      }
    } catch {}
    return blankState();
  }

  function saveState(next, notify = true) {
    const saved = normalize(next);
    localStorage.setItem(STATE_KEY, JSON.stringify(saved));
    localStorage.setItem(LEGACY_KEY, JSON.stringify(saved.selectedCourses));
    if (notify) window.dispatchEvent(new CustomEvent("studyspace:courses", { detail: saved }));
    return saved;
  }

  const state = () => loadState();
  const read = () => state().selectedCourses;
  const write = ids => saveState({ ...state(), selectedCourses: ids }).selectedCourses;
  const isMine = id => read().includes(id);
  const toggle = id => {
    const ids = read();
    write(ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id]);
  };
  const route = course => course.libraryRoute || `subject.html?s=${encodeURIComponent(course.id)}`;

  function groupName(course) {
    if (/Game Design/i.test(course.program || "")) return "Game Design";
    if (/Cyber Security/i.test(course.program || "") || course.subject === "Computer Science") return "Computer Science / Cybersecurity";
    if (course.subject === "Biomedical") return "Biomedical / Biotechnology";
    if (["Performing Arts", "Visual Arts"].includes(course.subject)) return "Fine Arts";
    if (course.subject === "Student Success") return "Other Electives";
    return course.subject;
  }

  const GROUP_ORDER = ["English", "Mathematics", "Science", "Social Studies", "Computer Science / Cybersecurity", "Engineering", "Biomedical / Biotechnology", "Game Design", "World Languages", "Fine Arts", "CTE", "Physical Education", "JROTC", "Other Electives"];
  function grouped(courses) {
    const groups = new Map();
    courses.forEach(course => {
      const name = groupName(course);
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(course);
    });
    return [...groups.entries()].sort(([a], [b]) => {
      const ai = GROUP_ORDER.indexOf(a), bi = GROUP_ORDER.indexOf(b);
      return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.localeCompare(b);
    });
  }

  const courseLine = course => `${esc(course.subject)} <span aria-hidden="true">•</span> ${esc(course.level)}`;
  function card(course, compact = false) {
    const mine = isMine(course.id);
    return `<article class="library-course-card${compact ? " compact" : ""}" data-course-id="${esc(course.id)}">
      <div class="library-card-top"><span class="course-icon" aria-hidden="true">${course.icon || "📚"}</span><div><h3><a href="${route(course)}">${esc(course.title)}</a></h3><p class="course-line">${courseLine(course)}</p><p class="course-grades">Grades ${esc((course.gradeLevels || []).join("–"))}</p></div></div>
      ${!compact && course.program && !/Traditional/.test(course.program) ? `<span class="course-program">${esc(course.program)}</span>` : ""}
      ${course.note ? `<div class="catalog-caution">${esc(course.note)}</div>` : ""}
      <div class="actions"><a class="btn primary small" href="${route(course)}">Open course</a><button class="btn small" type="button" data-toggle-course="${esc(course.id)}">${mine ? "Remove from My Courses" : "Add to My Courses"}</button></div>
    </article>`;
  }

  function bindToggles(container, rerender) {
    container.querySelectorAll("[data-toggle-course]").forEach(button => button.addEventListener("click", () => {
      toggle(button.dataset.toggleCourse);
      rerender();
    }));
  }

  function updateFeatured(courses) {
    const feature = document.querySelector("#featured .study-set");
    if (!feature) return;
    const course = courses[0];
    if (!course) {
      feature.innerHTML = `<div class="eyebrow">Build your dashboard</div><h3>Choose your first course</h3><p class="lead">Add the classes you take now. StudySpace will keep this page focused on your schedule.</p><div class="actions"><button class="btn primary" type="button" data-open-course-setup>Choose Courses</button><a class="btn" href="course-library.html">Browse Course Library</a></div>`;
      return;
    }
    feature.innerHTML = `<div class="eyebrow">Continue your course</div><h3>${esc(course.title)}</h3><p class="lead">Open the available course map, review its lessons, or practice with flashcards and original questions.</p><div class="tags"><span class="tag">${esc(course.subject)}</span><span class="tag">${esc(course.level)}</span><span class="tag">${course.units.length} units</span></div><div class="actions"><a class="btn primary" href="${route(course)}">Open course</a><a class="btn" href="course-flashcards.html?c=${encodeURIComponent(course.id)}">Study flashcards</a></div>`;
  }

  function renderHome() {
    const grid = document.querySelector("#subjectCards");
    if (!grid) return;
    const courses = read().map(id => library.course(id)).filter(Boolean);
    grid.innerHTML = courses.length ? courses.map(course => card(course, true)).join("") : `<div class="empty-state panel"><h3>You haven't added any courses yet.</h3><p class="muted">Choose your grade and add the classes you currently take. Your saved StudySpace progress remains separate from this list.</p><div class="actions"><button class="btn primary" type="button" data-open-course-setup>Choose Courses</button><a class="btn" href="course-library.html">Browse Courses</a></div></div>`;
    const count = document.querySelector("#myCourseCount");
    if (count) count.textContent = countLabel(courses.length);
    updateFeatured(courses);
    bindToggles(grid, renderHome);
    document.querySelectorAll("[data-open-course-setup]").forEach(button => button.onclick = () => openSetup(true));
  }

  function selectionCard(course, draft) {
    const checked = draft.has(course.id);
    return `<label class="setup-course${checked ? " selected" : ""}"><input type="checkbox" value="${esc(course.id)}" ${checked ? "checked" : ""}><span class="course-icon" aria-hidden="true">${course.icon || "📚"}</span><span><strong>${esc(course.title)}</strong><small>${courseLine(course)} · Grades ${esc((course.gradeLevels || []).join("–"))}</small></span><i aria-hidden="true">${checked ? "✓" : "+"}</i></label>`;
  }

  function openSetup(editing = false) {
    document.querySelector(".course-onboarding")?.remove();
    const current = state();
    let step = current.studentGrade ? 2 : 1;
    let grade = current.studentGrade;
    const draft = new Set(current.selectedCourses);
    const modal = document.createElement("div");
    modal.className = "course-onboarding";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", editing ? "Edit My Courses" : "Welcome to StudySpace");
    document.body.appendChild(modal);
    document.body.classList.add("setup-open");

    const close = () => { modal.remove(); document.body.classList.remove("setup-open"); };
    const finish = () => {
      saveState({ version: 2, onboardingComplete: true, studentGrade: grade, selectedCourses: [...draft] });
      close();
      renderHome();
      location.hash = "subjects";
      if (!editing) window.setTimeout(() => document.querySelector("[data-start-tour]")?.click(), 650);
    };

    const render = () => {
      const progress = `<div class="setup-progress" aria-label="Setup step ${step} of 3"><span class="${step >= 1 ? "active" : ""}">1</span><i></i><span class="${step >= 2 ? "active" : ""}">2</span><i></i><span class="${step >= 3 ? "active" : ""}">3</span></div>`;
      if (step === 1) {
        modal.innerHTML = `<div class="setup-shell"><div class="setup-top"><span class="logo" aria-hidden="true">S</span>${editing ? `<button class="setup-close" type="button" aria-label="Close course settings">×</button>` : ""}</div>${progress}<div class="eyebrow">Welcome to StudySpace</div><h1>Choose your grade.</h1><p class="lead">Your grade helps organize the Course Library. It never removes courses or progress.</p><div class="grade-choice">${["9", "10", "11", "12"].map(value => `<button type="button" data-setup-grade="${value}" class="${grade === value ? "selected" : ""}"><strong>${value}</strong><span>${gradeLabel(value)}</span></button>`).join("")}</div><div class="setup-actions"><span></span><button class="btn primary" type="button" data-setup-next ${grade ? "" : "disabled"}>Continue →</button></div></div>`;
      } else if (step === 2) {
        const choices = library.list().filter(course => course.gradeLevels.includes(grade));
        modal.innerHTML = `<div class="setup-shell setup-wide"><div class="setup-top"><button class="setup-back-link" type="button" data-setup-back>← Change grade</button>${editing ? `<button class="setup-close" type="button" aria-label="Close course settings">×</button>` : ""}</div>${progress}<div class="eyebrow">${gradeLabel(grade)}</div><h1>Choose your courses.</h1><p class="lead">Select the classes you take now. You can edit this list anytime.</p><div class="setup-selection-summary"><strong>${countLabel(draft.size)} selected</strong><button type="button" data-clear-selection>Clear selection</button></div><div class="setup-course-groups">${grouped(choices).map(([name, items]) => `<section><h2>${esc(name)}</h2><div>${items.map(course => selectionCard(course, draft)).join("")}</div></section>`).join("")}</div><div class="setup-actions"><button class="btn" type="button" data-setup-back>Back</button><button class="btn primary" type="button" data-setup-next>Review ${draft.size ? countLabel(draft.size) : "selection"} →</button></div></div>`;
      } else {
        const selected = [...draft].map(id => library.course(id)).filter(Boolean);
        modal.innerHTML = `<div class="setup-shell"><div class="setup-top"><button class="setup-back-link" type="button" data-setup-back>← Edit selection</button>${editing ? `<button class="setup-close" type="button" aria-label="Close course settings">×</button>` : ""}</div>${progress}<div class="eyebrow">Your Courses · ${gradeLabel(grade)}</div><h1>${selected.length ? "Your dashboard is ready." : "Continue with an empty dashboard?"}</h1><p class="lead">${selected.length ? "These courses will appear in My Courses." : "You can add courses later from the Course Library."}</p><div class="setup-review">${selected.length ? selected.map(course => `<article><span class="course-icon" aria-hidden="true">${course.icon || "📚"}</span><div><strong>${esc(course.title)}</strong><small>${courseLine(course)}</small></div><button type="button" data-remove-draft="${esc(course.id)}" aria-label="Remove ${esc(course.title)}">×</button></article>`).join("") : `<div class="empty-state"><p>No courses selected.</p></div>`}</div><div class="setup-actions"><button class="btn" type="button" data-setup-back>Back</button><button class="btn primary" type="button" data-finish-setup>${selected.length ? "Finish Setup" : "Continue without courses"}</button></div></div>`;
      }

      modal.querySelector(".setup-close")?.addEventListener("click", close);
      modal.querySelectorAll("[data-setup-grade]").forEach(button => button.addEventListener("click", () => { grade = button.dataset.setupGrade; render(); }));
      modal.querySelector("[data-setup-next]")?.addEventListener("click", () => { if (step === 1 && !grade) return; step += 1; render(); });
      modal.querySelectorAll("[data-setup-back]").forEach(button => button.addEventListener("click", () => { step = Math.max(1, step - 1); render(); }));
      modal.querySelector("[data-clear-selection]")?.addEventListener("click", () => { draft.clear(); render(); });
      modal.querySelectorAll(".setup-course input").forEach(input => input.addEventListener("change", () => {
        input.checked ? draft.add(input.value) : draft.delete(input.value);
        const option = input.closest(".setup-course");
        option.classList.toggle("selected", input.checked);
        option.querySelector("i").textContent = input.checked ? "✓" : "+";
        const total = modal.querySelector(".setup-selection-summary strong");
        if (total) total.textContent = `${countLabel(draft.size)} selected`;
        const next = modal.querySelector("[data-setup-next]");
        if (next) next.textContent = `Review ${draft.size ? countLabel(draft.size) : "selection"} →`;
      }));
      modal.querySelectorAll("[data-remove-draft]").forEach(button => button.addEventListener("click", () => { draft.delete(button.dataset.removeDraft); render(); }));
      modal.querySelector("[data-finish-setup]")?.addEventListener("click", finish);
    };

    modal.addEventListener("keydown", event => { if (event.key === "Escape" && editing) close(); });
    render();
  }

  function renderLibrary() {
    const grid = document.querySelector("#courseLibraryGrid");
    if (!grid || grid.dataset.ready === "true") return;
    grid.dataset.ready = "true";
    const all = library.list();
    const search = document.querySelector("#librarySearch");
    const subject = document.querySelector("#subjectFilter");
    const level = document.querySelector("#levelFilter");
    const program = document.querySelector("#programFilter");
    const summary = document.querySelector("#librarySummary");
    const empty = document.querySelector("#libraryEmpty");
    let activeGrade = state().studentGrade || "";
    let activeCollection = "";
    const unique = key => [...new Set(all.map(item => item[key]).filter(Boolean))].sort();
    subject.insertAdjacentHTML("beforeend", unique("subject").map(value => `<option>${esc(value)}</option>`).join(""));
    level.insertAdjacentHTML("beforeend", unique("level").map(value => `<option>${esc(value)}</option>`).join(""));
    program.insertAdjacentHTML("beforeend", unique("program").map(value => `<option>${esc(value)}</option>`).join(""));
    document.querySelector("#apCollectionCount").textContent = countLabel(library.collections.ap().length);
    document.querySelector("#aiceCollectionCount").textContent = countLabel(library.collections.aice().length);
    document.querySelector("#magnetCollectionCount").textContent = countLabel(library.collections.magnet().length);

    const draw = () => {
      const needle = search.value.trim().toLowerCase();
      const collectionIds = activeCollection === "magnet" ? new Set(library.collections.magnet().map(course => course.id)) : null;
      const hits = all.filter(course => {
        const text = `${course.title} ${course.subject} ${course.level} ${course.program} ${course.units.map(unit => `${unit.title} ${unit.topics.map(topic => topic.title).join(" ")}`).join(" ")}`.toLowerCase();
        return (!activeGrade || course.gradeLevels.includes(activeGrade)) && (!collectionIds || collectionIds.has(course.id)) && (!needle || text.includes(needle)) && (!subject.value || course.subject === subject.value) && (!level.value || course.level === level.value) && (!program.value || course.program === program.value);
      });
      document.querySelectorAll("[data-grade-tab]").forEach(button => { const active = button.dataset.gradeTab === activeGrade; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
      grid.innerHTML = grouped(hits).map(([name, courses]) => `<section class="grade-subject-group"><div class="section-head"><div><h2>${esc(name)}</h2><p>${countLabel(courses.length)}</p></div></div><div class="course-library-grid">${courses.map(course => card(course)).join("")}</div></section>`).join("");
      summary.textContent = `${countLabel(hits.length)}${activeGrade ? ` for ${gradeLabel(activeGrade)}` : " across all grades"}`;
      empty.hidden = hits.length > 0;
      bindToggles(grid, draw);
    };

    document.querySelectorAll("[data-grade-tab]").forEach(button => button.addEventListener("click", () => { activeGrade = button.dataset.gradeTab; draw(); }));
    [search, subject, level, program].forEach(control => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", () => { activeCollection = ""; draw(); }));
    document.querySelector("#clearLibraryFilters").addEventListener("click", () => { activeCollection = ""; search.value = subject.value = level.value = program.value = ""; draw(); search.focus(); });
    document.querySelectorAll("[data-collection]").forEach(link => link.addEventListener("click", () => {
      search.value = subject.value = program.value = "";
      activeGrade = "";
      const value = link.dataset.collection;
      if (value === "AP" || value === "AICE") level.value = value;
      else { level.value = ""; activeCollection = "magnet"; }
      draw();
    }));
    draw();
  }

  globalThis.StudySpaceCatalog = { state, read, write, toggle, isMine, route, renderHome, renderLibrary, openSetup };
  renderHome();
  renderLibrary();
  if (!state().onboardingComplete && document.querySelector("#subjectCards")) requestAnimationFrame(() => openSetup(false));
})();
