const TOUR_STORAGE_KEY = "studyspace-welcome-tour-v1";
let activeTour = null;
let tourScheduled = false;

function siteNav(back = "") {
  return `<a class="skip" href="#main">Skip to content</a>
    <nav class="site-nav" aria-label="Main navigation">
      <a class="brand" href="index.html" aria-label="StudySpace home">
        <span class="logo" aria-hidden="true">S</span><span>StudySpace</span>
      </a>
      <button class="mobile-tour" type="button" data-start-tour aria-label="Replay the StudySpace tour">Tour</button>
      <div class="navlinks">
        <a href="index.html#subjects">My Courses</a>
        <a href="course-library.html">Course Library</a>
        <a href="planner.html">Planner</a>
        <a href="study.html">Study This</a>
        <a href="feedback.html">Feedback</a>
        <details class="nav-more"><summary>More</summary><div><a href="index.html#focus">Focus timer</a><a href="index.html#founder">Team</a><button class="nav-tour" type="button" data-start-tour>Take a tour</button></div></details>
        ${back ? `<a href="${back}">Back</a>` : ""}
      </div>
    </nav>`;
}

function footer() {
  return `<footer><span>StudySpace · built by students, for students.</span><span><a href="feedback.html">Feedback</a> · <a href="index.html#founder">Team</a></span><button class="pwa-install" type="button" hidden>Install StudySpace</button></footer>`;
}

function syncFavicon() {
  let icon = document.querySelector('link[rel="icon"]');
  if (!icon) {
    icon = document.createElement("link");
    icon.rel = "icon";
    document.head.appendChild(icon);
  }
  icon.type = "image/svg+xml";
  icon.href = "assets/favicon.svg";

  let manifest = document.querySelector('link[rel="manifest"]');
  if (!manifest) {
    manifest = document.createElement("link");
    manifest.rel = "manifest";
    document.head.appendChild(manifest);
  }
  manifest.href = "manifest.webmanifest";
  let theme = document.querySelector('meta[name="theme-color"]');
  if (!theme) {
    theme = document.createElement("meta");
    theme.name = "theme-color";
    document.head.appendChild(theme);
  }
  theme.content = "#080d1b";
}

function loadScript(src, done = () => {}) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    if (existing.dataset.loaded === "true" || src.includes("course-frameworks") && globalThis.STUDYSPACE_COURSES || src.includes("middleton-course-library") && globalThis.MIDDLETON_COURSE_LIBRARY || src.includes("full-course-content") && globalThis.STUDYSPACE_LEARNING || src.includes("aphg-unit1") && globalThis.APHG_UNIT1 || src.includes("biology-course") && globalThis.BIOLOGY_COURSE || src.includes("algebra2-chapter1") && globalThis.ALGEBRA2_CHAPTER1 || src.includes("studyspace-core") && globalThis.StudySpace) done();
    else existing.addEventListener("load", done, { once: true });
    return;
  }
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => { script.dataset.loaded = "true"; done(); };
  document.body.appendChild(script);
}

function loadPlatform(done = () => {}) {
  loadScript("assets/data/course-frameworks.js?v=4", () => loadScript("assets/data/middleton-course-library.js?v=2", () => loadScript("assets/data/full-course-content.js?v=5", () => loadScript("assets/data/aphg-unit1.js", () => loadScript("assets/data/biology-course.js", () => loadScript("assets/data/algebra2-chapter1.js", () => loadScript("assets/studyspace-core.js?v=4", done)))))));
}

function renderSmartDashboard() {
  const hero = document.querySelector(".hero");
  if (!hero || !globalThis.StudySpace) return;
  document.querySelector("#smartDashboard")?.remove();
  const data = StudySpace.state;
  const upcoming = data.assessments.filter(item => (StudySpace.daysUntil(item.date) ?? -1) >= 0).slice(0, 3);
  const recent = data.quizAttempts.slice(-3).reverse();
  const selected = globalThis.StudySpaceCatalog?.read?.() || [];
  const selectedCourses = selected.map(id => globalThis.MIDDLETON_COURSE_LIBRARY?.course(id)).filter(Boolean);
  const cards = Object.values(data.flashcardMastery);
  const mastered = cards.filter(item => item.status === "mastered").length;
  const nextAssessment = upcoming[0];
  const plan = nextAssessment ? StudySpace.generatePlan(nextAssessment).filter(task => !task.complete).slice(0, 2) : [];
  const dueCount = StudySpace.dueReviews().length;
  const queue = data.studyQueue.slice(0, 3);
  const courseCards = selectedCourses.slice(0, 3).map((course, index) => {
    const next = StudySpace.nextBestStep(course.id);
    return `<article class="dash-card ${index === 0 ? "dash-primary" : ""}"><span class="dash-icon">${course.icon || "S"}</span><div class="eyebrow">${StudySpace.escapeHtml(next?.reason || course.subject)}</div><h3>${StudySpace.escapeHtml(course.title)}</h3><p>${next ? `Next: ${StudySpace.escapeHtml(next.title)}` : `${course.units.length} units with lessons, practice, and saved mastery.`}</p><a class="link" href="${next?.href || globalThis.StudySpaceCatalog.route(course)}">${next ? "Start next step" : "Open course"} →</a></article>`;
  }).join("");
  const courseArea = courseCards || `<article class="dash-card dash-primary"><span class="dash-icon">＋</span><div class="eyebrow">Start here</div><h3>Choose your courses</h3><p>Your dashboard begins empty so it only reflects the classes you actually take.</p><button class="plain-action" type="button" data-open-course-setup>Choose Courses →</button></article>`;
  const firstCourse = selectedCourses[0];
  const quick = firstCourse ? StudySpace.quickStudy(firstCourse.id, 10) : null;
  hero.insertAdjacentHTML("afterend", `<section id="smartDashboard" class="smart-dashboard" aria-labelledby="dashboardTitle">
    <div class="section-head"><div><div class="eyebrow">Your dashboard</div><h2 id="dashboardTitle">What needs attention now</h2></div><a class="btn small" href="planner.html">Open planner</a></div>
    <div class="dashboard-grid">
      ${courseArea}
      <article class="dash-card"><div class="eyebrow">Upcoming</div>${upcoming.length ? upcoming.map(item => `<a class="dash-row" href="planner.html"><strong>${StudySpace.escapeHtml(item.name)}</strong><span>${StudySpace.countdown(item.date)}</span></a>`).join("") : `<p class="muted">No assessments yet.</p><a class="link" href="planner.html">Add one →</a>`}</article>
      <article class="dash-card"><div class="eyebrow">Today's plan</div>${plan.length ? plan.map(task => `<div class="dash-row"><strong>${StudySpace.escapeHtml(task.title)}</strong><span>${task.minutes} min</span></div>`).join("") : `<p class="muted">Add an assessment to generate a realistic plan.</p>`}</article>
      <article class="dash-card"><div class="eyebrow">Review and queue</div><div class="dash-metrics"><span><strong>${dueCount}</strong> reviews due</span><span><strong>${mastered}</strong> cards mastered</span></div>${queue.length ? queue.map(item => `<a class="dash-row" href="${StudySpace.escapeHtml(item.href || "study.html")}"><strong>${StudySpace.escapeHtml(item.title)}</strong><span>Queued</span></a>`).join("") : `<p class="muted">Save a lesson to build your study queue.</p>`}</article>
      <article class="dash-card"><div class="eyebrow">Recent study</div>${data.recentStudy.length ? data.recentStudy.slice(0, 3).map(item => `<div class="dash-row"><strong>${StudySpace.escapeHtml(item.title || item.type)}</strong><span>${new Date(item.studiedAt).toLocaleDateString()}</span></div>`).join("") : `<div class="dash-metrics"><span><strong>${recent[0]?.percentage ?? "—"}${recent[0] ? "%" : ""}</strong> latest quiz</span></div><p class="muted">Your latest activities will appear here.</p>`}</article>
    </div>
    <div class="quick-actions" aria-label="Quick actions"><a href="study.html">Study This</a><a href="study.html#import">Scan / Import</a>${quick ? `<a href="${quick.href}">10-minute Quick Study</a>` : `<button type="button" data-open-course-setup>Choose Courses</button>`}${firstCourse ? `<a href="course-quiz.html?c=${encodeURIComponent(firstCourse.id)}">Practice Quiz</a><a href="course-flashcards.html?c=${encodeURIComponent(firstCourse.id)}">Flashcards</a>` : ""}<a href="planner.html#weeklyReview">Weekly Review</a><a href="#focus">Focus Timer</a><button type="button" data-dashboard-ai>Ask StudySpace AI</button></div>
  </section>`);
  document.querySelector("[data-dashboard-ai]")?.addEventListener("click", () => StudySpace.openAI("Help me choose what to study next based on the StudySpace page and my request." , false));
  document.querySelectorAll("#smartDashboard [data-open-course-setup]").forEach(button => button.onclick = () => StudySpaceCatalog.openSetup(true));
}

function upgradeHomeSearch() {
  const input = document.querySelector("#studySearch");
  const results = document.querySelector("#searchResults");
  if (!input || !results || !globalThis.APHG_UNIT1) return;
  const unit = APHG_UNIT1;
  const frameworkIndex = Object.values(globalThis.STUDYSPACE_COURSES?.courses || {}).flatMap(course => course.units.flatMap(courseUnit => [
    { title: `${course.title}: ${courseUnit.title}`, desc: `${courseUnit.summary} ${courseUnit.topics.map(topic => topic.title).join(" ")}`, href: `course-unit.html?c=${course.id}&u=${encodeURIComponent(courseUnit.id)}`, kind: courseUnit.contentStatus === "class-aligned" ? "Class-aligned unit" : "Framework-aligned unit" },
    ...courseUnit.topics.map(topic => {
      const lesson = globalThis.STUDYSPACE_LEARNING?.lesson(course.id, courseUnit.id, topic.id);
      return { title: `${course.title} ${topic.id}: ${topic.title}`, desc: `${topic.summary} ${(lesson?.vocabulary || []).map(item => `${item.term} ${item.definition}`).join(" ")}`, href: `course-lesson.html?c=${course.id}&u=${encodeURIComponent(courseUnit.id)}&l=${encodeURIComponent(topic.id)}`, kind: topic.contentStatus === "class-aligned" ? "Class-aligned lesson" : "Framework-aligned lesson" };
    })
  ]));
  const index = [
    ...frameworkIndex,
    ...unit.topics.map(topic => ({ title: `Topic ${topic.id}: ${topic.title}`, desc: topic.essentials.join(" "), href: `aphg-topic.html?t=${topic.id}`, kind: "APHG topic" })),
    ...unit.vocabulary.map(term => ({ title: term.term, desc: `${term.definition} ${term.example}`, href: `aphg-review.html?term=${term.id}`, kind: `Vocabulary · Topic ${term.topic}` })),
    ...(globalThis.BIOLOGY_COURSE?.sequences || []).map(sequence => ({ title: `Biology ${sequence.id}: ${sequence.title}`, desc: `${sequence.summary} ${sequence.masteryTags.join(" ")}`, href: `biology-topic.html?t=${sequence.id}`, kind: "Biology sequence" })),
    ...(globalThis.BIOLOGY_COURSE?.vocabulary || []).map(term => ({ title: term.term, desc: `${term.definition} ${term.example}`, href: `biology-flashcards.html?topic=${term.topic}`, kind: `Biology vocabulary · ${term.topic}` })),
    ...(globalThis.ALGEBRA2_CHAPTER1?.sections || []).map(section => ({ title: `Algebra 2 ${section.id}: ${section.title}`, desc: `${section.description} ${section.masteryTags.join(" ")}`, href: `algebra2-section.html?s=${section.id}`, kind: "Algebra 2 section" })),
    ...(globalThis.ALGEBRA2_CHAPTER1?.flashcards || []).map(card => ({ title: card.term, desc: `${card.definition} ${card.example}`, href: `algebra2-flashcards.html?section=${card.topic}`, kind: `Algebra 2 rule · ${card.topic}` })),
    { title: "APHG adaptive flashcards", desc: "Study all, still learning, weak topics, or missed quiz concepts", href: "aphg-flashcards.html", kind: "Tool" },
    { title: "APHG quiz builder", desc: "Quick, standard, full, topic, weak, and mistake quizzes", href: "aphg-quiz.html", kind: "Tool" },
    { title: "Class materials", desc: "Teacher materials, AMSCO source slot, and vocabulary assignment", href: "aphg.html#materialsTitle", kind: "Sources" },
    { title: "Smart Study Planner", desc: "Assessments, countdowns, daily plans, and focus sessions", href: "planner.html", kind: "Tool" },
    { title: "Study This and Import", desc: "Paste material, scan a worksheet, save a set, or restore a backup", href: "study.html", kind: "Tool" },
    { title: "Send feedback", desc: "Report missing content, incorrect information, class updates, bugs, or ideas", href: "feedback.html", kind: "Tool" },
    { title: "CSIT Essentials", desc: "Hardware lessons, flashcards, and practice quiz", href: "csit-essentials.html", kind: "Subject" },
    { title: "Biology 1 Honors", desc: "5E Unit 1 lessons, flashcards, mastery, mistakes, and practice", href: "biology.html", kind: "Subject" },
    { title: "Biology My Mistakes", desc: "Review, retry, and explain missed Biology concepts", href: "biology-mistakes.html", kind: "Tool" },
    { title: "Algebra 2 Chapter 1", desc: "Interactive functions, transformations, models, inequalities, and piecewise functions", href: "algebra2.html", kind: "Subject" },
    { title: "Algebra 2 generated practice", desc: "Progressive hints, specific mistake feedback, and similar problems", href: "algebra2-practice.html", kind: "Tool" },
    { title: "Algebra 2 My Mistakes", desc: "Review misconceptions and retry similar original problems", href: "algebra2-mistakes.html", kind: "Tool" },
    { title: "Focus Timer", desc: "Start a focused study session", href: "#focus", kind: "Tool" }
  ];
  input.placeholder = "Search topics, vocabulary, tools—or type “quiz me on 1.6”…";
  input.oninput = () => {
    const query = input.value.trim().toLowerCase();
    if (!query) return void (results.hidden = true);
    const selectedIds = globalThis.StudySpaceCatalog?.read?.() || [];
    const primaryCourse = globalThis.MIDDLETON_COURSE_LIBRARY?.course(selectedIds[0]);
    const commandTopic = query.match(/(?:quiz me|practice|quiz).*?(\d+(?:\.\d+)?)/);
    const commandCourse = commandTopic ? Object.values(globalThis.STUDYSPACE_COURSES?.courses || {}).find(course => course.units.some(unitItem => unitItem.topics.some(topicItem => topicItem.id === commandTopic[1])) && (!primaryCourse || course.id === primaryCourse.id)) || globalThis.STUDYSPACE_COURSES?.course("aphg") : null;
    const topicUnit = commandCourse?.units.find(unitItem => unitItem.topics.some(topicItem => topicItem.id === commandTopic?.[1]));
    const focusCommand = query.match(/(?:focus|timer).*?(\d{1,3})/);
    const commands = commandTopic && commandCourse && topicUnit ? [{ title: `Quiz ${commandCourse.title} ${commandTopic[1]}`, desc: "Command", href: `course-quiz.html?c=${encodeURIComponent(commandCourse.id)}&u=${encodeURIComponent(topicUnit.id)}&topic=${encodeURIComponent(commandTopic[1])}`, kind: "Action" }] : focusCommand ? [{ title: `Start a ${Math.min(120, Math.max(1, Number(focusCommand[1])))}-minute focus session`, desc: "Command", href: `index.html?minutes=${Math.min(120, Math.max(1, Number(focusCommand[1])))}#focus`, kind: "Action" }] : /study.*weak/.test(query) && primaryCourse ? [{ title: `Study the next weak area in ${primaryCourse.title}`, desc: "Uses measured mastery and prerequisites", href: StudySpace.nextBestStep(primaryCourse.id)?.href || globalThis.StudySpaceCatalog.route(primaryCourse), kind: "Action" }] : /study.*mistake/.test(query) && primaryCourse ? [{ title: `Review ${primaryCourse.title} mistakes`, desc: "Grouped by concept", href: `course-mistakes.html?c=${encodeURIComponent(primaryCourse.id)}`, kind: "Action" }] : [];
    const words = query.split(/\s+/).filter(Boolean);
    const hits = index.filter(item => words.every(word => `${item.title} ${item.desc} ${item.kind}`.toLowerCase().includes(word))).slice(0, 8);
    const shown = [...commands, ...hits].slice(0, 8);
    results.innerHTML = shown.length ? shown.map(item => `<a class="search-item" href="${item.href}"><strong>${StudySpace.escapeHtml(item.title)}</strong><span>${StudySpace.escapeHtml(item.kind)} · ${StudySpace.escapeHtml(item.desc.slice(0, 115))}</span></a>`).join("") : `<a class="search-item" href="study.html"><strong>No match yet — import this material</strong><span>Paste notes or ask StudySpace AI</span></a>`;
    results.hidden = false;
  };
}

function connectFocusTask() {
  const focus = document.querySelector("#focus");
  if (!focus) return;
  let task = new URLSearchParams(location.search).get("focusTask") || sessionStorage.getItem("studyspace-focus-task") || "";
  if (task) sessionStorage.setItem("studyspace-focus-task", task.slice(0, 160));
  const heading = focus.querySelector("h3");
  const status = focus.querySelector("#timerStatus");
  const timer = focus.querySelector("#timer");
  const start = focus.querySelector("#timerStart");
  const reset = focus.querySelector("#timerReset");
  const taskInput = focus.querySelector("#focusTaskInput");
  const customInput = focus.querySelector("#customFocusMinutes");
  let initialMinutes = Math.min(120, Math.max(1, Number(new URLSearchParams(location.search).get("minutes")) || Number(globalThis.StudySpace?.state?.preferences?.focusMinutes) || 25));
  let remaining = initialMinutes * 60;
  let timerId = null;
  const draw = () => { timer.textContent = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`; };
  if (task && heading) heading.textContent = task.slice(0, 80);
  if (taskInput) { taskInput.value = task; taskInput.oninput = () => { task = taskInput.value.trim().slice(0, 120); if (task) sessionStorage.setItem("studyspace-focus-task", task); }; }
  if (customInput) customInput.value = initialMinutes;
  if (status) status.textContent = task ? "Your selected task is ready. Start when you are ready to focus." : "Pick one goal. Work until the timer ends.";
  start.onclick = () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      start.textContent = "Resume";
      status.textContent = "Paused. Take a breath, then keep going.";
      return;
    }
    start.textContent = "Pause";
    status.textContent = task ? `Focusing on: ${task}` : "Focus session in progress.";
    timerId = setInterval(() => {
      remaining -= 1;
      draw();
      if (remaining <= 0) {
        clearInterval(timerId);
        timerId = null;
        start.textContent = "Start again";
        status.textContent = "Session complete — nice work! Return to your plan when ready.";
        if (globalThis.StudySpace) StudySpace.update(data => data.studySessions.push({ id: `session-${Date.now()}`, task: task || "Focus session", minutes: initialMinutes, completedAt: new Date().toISOString() }));
      }
    }, 1000);
  };
  reset.onclick = () => {
    clearInterval(timerId);
    timerId = null;
    remaining = initialMinutes * 60;
    start.textContent = "Start";
    status.textContent = task ? "Task ready. Start when you are ready." : "Pick one goal. Work until the timer ends.";
    draw();
  };
  focus.querySelectorAll("[data-focus-minutes]").forEach(button => button.onclick = () => {
    if (timerId) return;
    initialMinutes = Number(button.dataset.focusMinutes);
    remaining = initialMinutes * 60;
    focus.querySelectorAll("[data-focus-minutes]").forEach(item => item.classList.toggle("active", item === button));
    if (customInput) customInput.value = initialMinutes;
    StudySpace.update(data => { data.preferences.focusMinutes = initialMinutes; });
    draw();
  });
  if (customInput) customInput.onchange = () => {
    if (timerId) return;
    initialMinutes = Math.min(120, Math.max(1, Number(customInput.value) || 25));
    remaining = initialMinutes * 60;
    focus.querySelectorAll("[data-focus-minutes]").forEach(item => item.classList.remove("active"));
    StudySpace.update(data => { data.preferences.focusMinutes = initialMinutes; });
    draw();
  };
  draw();
}

function registerPwa() {
  const status = document.createElement("div");
  status.className = "connection-status";
  status.setAttribute("role", "status");
  status.hidden = navigator.onLine;
  status.textContent = "Offline — saved material still works; StudySpace AI needs internet.";
  document.body.appendChild(status);
  const updateConnection = () => { status.hidden = navigator.onLine; };
  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);
  let installPrompt = null;
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    document.querySelectorAll(".pwa-install").forEach(button => {
      button.hidden = false;
      button.onclick = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        await installPrompt.userChoice;
        installPrompt = null;
        button.hidden = true;
      };
    });
  });
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function renderTeam() {
  const featured = document.querySelector("#featured");
  if (!featured || document.querySelector("#founder")) return;

  featured.insertAdjacentHTML("afterend", `
    <section id="founder" class="team-section" aria-labelledby="founder-title">
      <div class="section-head">
        <div>
          <div class="eyebrow">The people behind StudySpace</div>
          <h2 id="founder-title">Built by students, for students.</h2>
        </div>
        <span class="muted">Student-led</span>
      </div>
      <div class="team-grid">
        <article class="founder-spotlight">
          <div class="profile-avatar founder-avatar" aria-hidden="true">RS</div>
          <div class="profile-copy">
            <span class="profile-role">Founder &amp; President</span>
            <h3>Rajeev Sreenivasachar</h3>
            <p>Rajeev founded StudySpace to make studying clearer, calmer, and more useful for students.</p>
            <div class="profile-values" aria-label="Rajeev's values">
              <span>Student-first</span><span>Product vision</span><span>Learning design</span>
            </div>
            <a class="link" href="https://t.me/rsreenivasachar27" target="_blank" rel="noopener">Message Rajeev on Telegram →</a>
          </div>
        </article>
        <article class="team-member-card">
          <div class="profile-avatar" aria-hidden="true">RM</div>
          <div class="profile-copy"><span class="profile-role">Vice President</span><h3>Rudhran Makesh</h3><p>Rudhran helps lead StudySpace as Vice President.</p><a class="link" href="https://t.me/RudhranMakesh" target="_blank" rel="noopener">Message Rudhran on Telegram →</a></div>
        </article>
      </div>
    </section>`);
}

function loadChatbot() {
  if (!document.querySelector('link[href^="assets/chatbot.css"]')) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "assets/chatbot.css?v=1";
    document.head.appendChild(css);
  }
  if (!document.querySelector('script[src^="assets/chatbot.js"]')) {
    const script = document.createElement("script");
    script.src = "assets/chatbot.js?v=3";
    document.body.appendChild(script);
  }
}

function tourSteps() {
  const steps = [
    {
      target: ".brand",
      title: "Welcome to StudySpace",
      text: "This is your calm home base for flashcards, quizzes, reviews, focus sessions, and study help."
    },
    {
      target: document.querySelector("#subjects") ? "#subjects" : ".site-nav",
      title: "Move between subjects",
      text: "Use My Courses for your personal dashboard, or open Course Library to browse by grade and subject without affecting saved progress."
    }
  ];

  if (document.querySelector("#featured")) {
    steps.push({
      target: "#featured",
      title: "Pick a study activity",
      text: "Open flashcards, take a practice quiz, scan a quick review, or start a 25-minute focus session."
    });
  } else if (document.querySelector(".resource-grid")) {
    steps.push({
      target: ".resource-grid",
      title: "Choose a resource",
      text: "Each subject page groups its available lessons, flashcards, and quizzes in one place."
    });
  }

  steps.push({
    target: ".ssai-toggle",
    title: "Meet StudySpace AI",
    text: "Tap the sparkle button anytime. The assistant can use the current page, explain concepts, read an uploaded screenshot, navigate, and scroll for you."
  });

  if (document.querySelector("#founder")) {
    steps.push({
      target: "#founder",
      title: "A student-led project",
      text: "StudySpace was founded by Rajeev Sreenivasachar to help students learn with more confidence."
    });
  }

  return steps.filter(step => document.querySelector(step.target));
}

function positionTourCard(card, target) {
  if (window.innerWidth <= 600) {
    card.style.width = "";
    card.style.top = "auto";
    card.style.left = "14px";
    card.style.right = "14px";
    card.style.bottom = "14px";
    card.style.inset = "auto 14px 14px 14px";
    return;
  }

  const rect = target.getBoundingClientRect();
  const width = Math.min(390, window.innerWidth - 32);
  const left = Math.max(16, Math.min(rect.left, window.innerWidth - width - 16));
  const targetIsLow = rect.top > window.innerHeight / 2;
  card.style.width = `${width}px`;
  card.style.left = `${left}px`;
  card.style.right = "auto";
  card.style.bottom = "auto";
  card.style.top = targetIsLow
    ? `${Math.max(16, rect.top - card.offsetHeight - 24)}px`
    : `${Math.min(window.innerHeight - card.offsetHeight - 16, rect.bottom + 24)}px`;
}

function closeTour(remember = true) {
  if (!activeTour) return;
  activeTour.target?.classList.remove("tour-highlight");
  activeTour.card.remove();
  activeTour.backdrop.remove();
  window.removeEventListener("resize", activeTour.reposition);
  document.removeEventListener("keydown", activeTour.onKeydown);
  activeTour = null;
  if (remember) localStorage.setItem(TOUR_STORAGE_KEY, "complete");
}

function showTourStep(index) {
  if (!activeTour) return;
  const { steps, card } = activeTour;
  const step = steps[index];
  if (!step) return closeTour();

  activeTour.target?.classList.remove("tour-highlight");
  const target = document.querySelector(step.target);
  if (!target) return showTourStep(index + 1);

  activeTour.index = index;
  activeTour.target = target;
  target.classList.add("tour-highlight");
  target.scrollIntoView({ behavior: "smooth", block: "center" });

  card.innerHTML = `
    <div class="tour-topline"><span>Quick tour</span><button type="button" class="tour-skip" data-tour-close aria-label="Skip tour">Skip</button></div>
    <div class="tour-arrow" aria-hidden="true">➜</div>
    <h2>${step.title}</h2>
    <p>${step.text}</p>
    <div class="tour-progress" aria-label="Step ${index + 1} of ${steps.length}">
      ${steps.map((_, itemIndex) => `<span class="${itemIndex === index ? "active" : ""}"></span>`).join("")}
    </div>
    <div class="tour-actions">
      <button type="button" class="btn small" data-tour-back ${index === 0 ? "disabled" : ""}>Back</button>
      <button type="button" class="btn primary small" data-tour-next>${index === steps.length - 1 ? "Finish" : "Next"}</button>
    </div>`;

  card.querySelector("[data-tour-close]").onclick = () => closeTour();
  card.querySelector("[data-tour-back]").onclick = () => showTourStep(index - 1);
  card.querySelector("[data-tour-next]").onclick = () => {
    if (index === steps.length - 1) closeTour();
    else showTourStep(index + 1);
  };

  window.setTimeout(() => {
    if (!activeTour) return;
    positionTourCard(card, target);
    card.querySelector("[data-tour-next]")?.focus({ preventScroll: true });
  }, 380);
}

function startTour() {
  closeTour(false);
  const steps = tourSteps();
  if (!steps.length) return;

  const backdrop = document.createElement("div");
  backdrop.className = "tour-backdrop";
  const card = document.createElement("aside");
  card.className = "tour-card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-label", "Welcome tour");
  document.body.append(backdrop, card);

  const reposition = () => activeTour && positionTourCard(card, activeTour.target);
  const onKeydown = event => {
    if (event.key === "Escape") closeTour();
    if (event.key === "ArrowRight" && activeTour) showTourStep(Math.min(activeTour.index + 1, steps.length - 1));
    if (event.key === "ArrowLeft" && activeTour) showTourStep(Math.max(activeTour.index - 1, 0));
  };
  activeTour = { steps, index: 0, target: null, card, backdrop, reposition, onKeydown };
  window.addEventListener("resize", reposition);
  document.addEventListener("keydown", onKeydown);
  showTourStep(0);
}

function scheduleWelcomeTour() {
  if (activeTour || tourScheduled || localStorage.getItem(TOUR_STORAGE_KEY) === "complete") return;
  tourScheduled = true;
  const startWhenAiIsReady = attempt => {
    if (document.querySelector(".ssai-toggle") || attempt >= 12) {
      tourScheduled = false;
      startTour();
    } else {
      window.setTimeout(() => startWhenAiIsReady(attempt + 1), 200);
    }
  };
  window.setTimeout(() => startWhenAiIsReady(0), 500);
}

function setupTour() {
  document.querySelectorAll("[data-start-tour]").forEach(button => {
    button.addEventListener("click", startTour);
  });
  let courseSetupComplete = false;
  try { courseSetupComplete = JSON.parse(localStorage.getItem("studyspace-course-setup-v2"))?.onboardingComplete === true; } catch {}
  if (courseSetupComplete) scheduleWelcomeTour();
}

document.addEventListener("DOMContentLoaded", () => {
  syncFavicon();
  document.querySelectorAll("[data-nav]").forEach(el => {
    el.innerHTML = siteNav(el.dataset.back || "");
  });
  document.querySelectorAll("[data-footer]").forEach(el => {
    el.innerHTML = footer();
  });
  renderTeam();
  loadPlatform(() => {
    renderSmartDashboard();
    upgradeHomeSearch();
    connectFocusTask();
  });
  loadChatbot();
  setupTour();
  window.addEventListener("studyspace:courses", event => {
    renderSmartDashboard();
    if (event.detail?.onboardingComplete) scheduleWelcomeTour();
  });
  registerPwa();
});
