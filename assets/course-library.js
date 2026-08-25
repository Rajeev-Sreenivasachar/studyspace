(function () {
  "use strict";
  const KEY = "studyspace-my-courses-v1";
  const DEFAULTS = ["aphg", "algebra2", "csit-foundations", "csit-essentials", "orchestra", "biology", "english", "thinking-skills"];
  const library = globalThis.MIDDLETON_COURSE_LIBRARY;
  if (!library) return;
  const esc = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const read = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY));
      if (Array.isArray(parsed)) return [...new Set(parsed.filter(id => library.course(id)))];
    } catch {}
    return DEFAULTS.filter(id => library.course(id));
  };
  const write = ids => {
    localStorage.setItem(KEY, JSON.stringify([...new Set(ids.filter(id => library.course(id)))]));
    window.dispatchEvent(new CustomEvent("studyspace:courses", { detail: ids }));
  };
  const isMine = id => read().includes(id);
  const toggle = id => {
    const ids = read();
    write(ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id]);
  };
  const route = course => course.libraryRoute || `subject.html?s=${encodeURIComponent(course.id)}`;
  const programLabel = value => String(value || "").replace("Traditional / Magnet", "Traditional + Magnet");
  const countLabel = count => `${count} course${count === 1 ? "" : "s"}`;

  function card(course, compact = false) {
    const mine = isMine(course.id);
    const metadata = compact ? "" : `<div class="library-meta"><span>${esc(course.subject)}</span><span>${esc(course.level)}</span><span>Grades ${esc((course.gradeLevels || []).join(", "))}</span><span>${esc(programLabel(course.program))}</span></div>`;
    return `<article class="library-course-card${compact ? " compact" : ""}" data-course-id="${esc(course.id)}">
      <div class="library-card-top"><span class="course-icon">${course.icon || "📚"}</span><div><span class="verified-chip">✓ Verified · ${esc(course.sourceYear)}</span><h3><a href="${route(course)}">${esc(course.title)}</a></h3></div></div>
      ${metadata}
      <p>${esc(course.summary)}</p>
      ${compact ? "" : `<dl><div><dt>Code</dt><dd>${esc(course.courseCode || "Not listed by Middleton")}</dd></div><div><dt>Credits</dt><dd>${esc(course.credits || "Not listed by Middleton")}</dd></div><div><dt>Prerequisite</dt><dd>${esc(course.prerequisites || "Not stated")}</dd></div></dl>`}
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

  function renderHome() {
    const grid = document.querySelector("#subjectCards");
    if (!grid) return;
    const courses = read().map(id => library.course(id)).filter(Boolean);
    grid.innerHTML = courses.length ? courses.map(course => card(course, true)).join("") : `<div class="empty-state panel"><h3>Your dashboard is ready</h3><p class="muted">Add verified Middleton courses from the library. Existing mastery and history remain saved even when a course is not shown here.</p><a class="btn primary" href="course-library.html">Browse Course Library</a></div>`;
    const count = document.querySelector("#myCourseCount");
    if (count) count.textContent = countLabel(courses.length);
    bindToggles(grid, renderHome);
  }

  function renderLibrary() {
    const grid = document.querySelector("#courseLibraryGrid");
    if (!grid) return;
    const all = library.list();
    const search = document.querySelector("#librarySearch");
    const subject = document.querySelector("#subjectFilter");
    const level = document.querySelector("#levelFilter");
    const grade = document.querySelector("#gradeFilter");
    const program = document.querySelector("#programFilter");
    const summary = document.querySelector("#librarySummary");
    const empty = document.querySelector("#libraryEmpty");
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
        const text = `${course.title} ${course.subject} ${course.level} ${course.program} ${course.summary} ${course.units.map(unit => `${unit.title} ${unit.topics.map(topic => topic.title).join(" ")}`).join(" ")}`.toLowerCase();
        return (!collectionIds || collectionIds.has(course.id)) && (!needle || text.includes(needle)) && (!subject.value || course.subject === subject.value) && (!level.value || course.level === level.value) && (!grade.value || (course.gradeLevels || []).includes(grade.value)) && (!program.value || course.program === program.value);
      });
      grid.innerHTML = hits.map(course => card(course)).join("");
      summary.textContent = `${countLabel(hits.length)} shown · ${countLabel(all.length)} verified from the ${library.schoolYear} Middleton sheets`;
      empty.hidden = hits.length > 0;
      bindToggles(grid, draw);
    };
    [search, subject, level, grade, program].forEach(control => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", () => { activeCollection = ""; draw(); }));
    document.querySelector("#clearLibraryFilters").addEventListener("click", () => { activeCollection = ""; search.value = subject.value = level.value = grade.value = program.value = ""; draw(); search.focus(); });
    document.querySelectorAll("[data-collection]").forEach(link => link.addEventListener("click", () => {
      search.value = subject.value = grade.value = program.value = "";
      const value = link.dataset.collection;
      if (value === "AP" || value === "AICE") level.value = value;
      else { level.value = ""; activeCollection = "magnet"; }
      draw();
    }));
    draw();
  }

  globalThis.StudySpaceCatalog = { read, write, toggle, isMine, route, renderHome, renderLibrary };
  renderHome();
  renderLibrary();
})();
