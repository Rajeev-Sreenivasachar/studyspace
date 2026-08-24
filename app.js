const SUBJECTS = {
  algebra2: ["Algebra 2 Honors", "➗"],
  biology: ["Biology 1 Honors", "🧬"],
  english: ["English 1 Honors", "📖"],
  "csit-foundations": ["CSIT Foundations", "💻"],
  "csit-essentials": ["CSIT Essentials", "🖥️"],
  orchestra: ["Orchestra 1", "🎻"],
  "thinking-skills": ["AICE Thinking Skills", "💡"]
};

const TOUR_STORAGE_KEY = "studyspace-welcome-tour-v1";
let activeTour = null;

function siteNav(back = "") {
  return `<a class="skip" href="#main">Skip to content</a>
    <nav class="site-nav" aria-label="Main navigation">
      <a class="brand" href="index.html" aria-label="StudySpace home">
        <span class="logo" aria-hidden="true">S</span><span>StudySpace</span>
      </a>
      <button class="mobile-tour" type="button" data-start-tour aria-label="Replay the StudySpace tour">Tour</button>
      <div class="navlinks">
        <a href="index.html#subjects">Subjects</a>
        <a href="planner.html">Planner</a>
        <a href="study.html">Study This</a>
        <a href="index.html#founder">Our story</a>
        <a href="index.html#focus">Focus timer</a>
        <button class="nav-tour" type="button" data-start-tour>Take a tour</button>
        ${back ? `<a href="${back}">Back</a>` : ""}
      </div>
    </nav>`;
}

function footer() {
  return `<footer><span>StudySpace • founded by Rajeev Sreenivasachar • built to help students lock in</span><button class="pwa-install" type="button" hidden>Install StudySpace</button></footer>`;
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
    if (existing.dataset.loaded === "true" || src.includes("aphg-unit1") && globalThis.APHG_UNIT1 || src.includes("studyspace-core") && globalThis.StudySpace) done();
    else existing.addEventListener("load", done, { once: true });
    return;
  }
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => { script.dataset.loaded = "true"; done(); };
  document.body.appendChild(script);
}

function loadPlatform(done = () => {}) {
  loadScript("assets/data/course-frameworks.js?v=2", () => loadScript("assets/data/aphg-unit1.js", () => loadScript("assets/data/biology-course.js", () => loadScript("assets/data/algebra2-chapter1.js", () => loadScript("assets/studyspace-core.js", done)))));
}

function renderSmartDashboard() {
  const hero = document.querySelector(".hero");
  if (!hero || document.querySelector("#smartDashboard") || !globalThis.StudySpace) return;
  const data = StudySpace.state;
  const upcoming = data.assessments.filter(item => (StudySpace.daysUntil(item.date) ?? -1) >= 0).slice(0, 3);
  const recent = data.quizAttempts.slice(-3).reverse();
  const weak = StudySpace.weakTopics().slice(0, 3);
  const biologyUnit = globalThis.BIOLOGY_COURSE?.unit1;
  const biologyMastery = biologyUnit ? StudySpace.allMastery(biologyUnit) : [];
  const biologyWeak = biologyUnit ? StudySpace.weakTopics(biologyUnit) : [];
  const biologyStarted = biologyMastery.some(item => item.evidence > 0);
  const biologyNext = biologyWeak[0]?.topic || biologyMastery.find(item => item.label !== "Mastered")?.topic || "1.1";
  const algebraUnit = globalThis.ALGEBRA2_CHAPTER1?.chapter1;
  const algebraMastery = algebraUnit ? StudySpace.allMastery(algebraUnit) : [];
  const algebraStarted = algebraMastery.some(item => item.evidence > 0);
  const algebraNext = algebraMastery.filter(item => item.score !== null).sort((a,b)=>a.score-b.score)[0]?.topic || algebraMastery.find(item => item.evidence < 3)?.topic || "1.1";
  const featuredTitle = document.querySelector("#featured .study-set h3");
  const featuredTermTag = document.querySelector("#featured .study-set .tag");
  if (featuredTitle) featuredTitle.textContent = "Unit 1 Vocab — Terms 1–46";
  if (featuredTermTag) featuredTermTag.textContent = "46 terms";
  const cards = Object.values(data.flashcardMastery);
  const mastered = cards.filter(item => item.status === "mastered").length;
  const nextAssessment = upcoming[0];
  const plan = nextAssessment ? StudySpace.generatePlan(nextAssessment).filter(task => !task.complete).slice(0, 2) : [];
  hero.insertAdjacentHTML("afterend", `<section id="smartDashboard" class="smart-dashboard" aria-labelledby="dashboardTitle">
    <div class="section-head"><div><div class="eyebrow">Your dashboard</div><h2 id="dashboardTitle">What needs attention now</h2></div><a class="btn small" href="planner.html">Open planner</a></div>
    <div class="dashboard-grid">
      <article class="dash-card dash-primary"><span class="dash-icon">▶</span><div class="eyebrow">Continue studying</div><h3>AP Human Geography Unit 1</h3><p>${weak.length ? `Start with Topic ${weak[0].topic}, currently your weakest measured topic.` : "Build your first mastery data with a quick quiz or flashcard round."}</p><a class="link" href="${weak.length ? `aphg-topic.html?t=${weak[0].topic}` : "aphg.html"}">Continue →</a></article>
      <article class="dash-card"><span class="dash-icon">🧬</span><div class="eyebrow">Biology Unit 1</div><h3>${biologyStarted ? `Continue Sequence ${biologyNext}` : "Start with Properties of Water"}</h3><p>${biologyStarted ? `${biologyMastery.filter(item => item.evidence > 0).length} of 5 sequences have saved activity.` : "Follow the 5E path and build real concept mastery."}</p><a class="link" href="biology-topic.html?t=${biologyNext}">Study Biology →</a></article>
      <article class="dash-card"><span class="dash-icon">➗</span><div class="eyebrow">Algebra 2 Chapter 1</div><h3>${algebraStarted ? `Continue Section ${algebraNext}` : "Start with Parent Functions"}</h3><p>${algebraStarted ? `${algebraMastery.filter(item => item.evidence > 0).length} of 6 sections have saved activity.` : "Use visual models, progressive hints, and generated practice."}</p><a class="link" href="algebra2-section.html?s=${algebraNext}">Study Algebra 2 →</a></article>
      <article class="dash-card"><div class="eyebrow">Upcoming</div>${upcoming.length ? upcoming.map(item => `<a class="dash-row" href="planner.html"><strong>${StudySpace.escapeHtml(item.name)}</strong><span>${StudySpace.countdown(item.date)}</span></a>`).join("") : `<p class="muted">No assessments yet.</p><a class="link" href="planner.html">Add one →</a>`}</article>
      <article class="dash-card"><div class="eyebrow">Today's plan</div>${plan.length ? plan.map(task => `<div class="dash-row"><strong>${StudySpace.escapeHtml(task.title)}</strong><span>${task.minutes} min</span></div>`).join("") : `<p class="muted">Add an assessment to generate a realistic plan.</p>`}</article>
      <article class="dash-card"><div class="eyebrow">Recent progress</div><div class="dash-metrics"><span><strong>${mastered}</strong> cards mastered</span><span><strong>${recent[0]?.percentage ?? "—"}${recent[0] ? "%" : ""}</strong> latest quiz</span></div>${weak.length ? `<p class="muted">Weak: ${weak.map(item => `Topic ${item.topic}`).join(", ")}</p>` : `<p class="muted">Mastery appears only after enough activity.</p>`}</article>
    </div>
    <div class="quick-actions" aria-label="Quick actions"><a href="study.html">Study This</a><a href="study.html#import">Scan / Import</a><a href="aphg-quiz.html">Practice Quiz</a><a href="aphg-flashcards.html">Flashcards</a><a href="#focus">Focus Timer</a><button type="button" data-dashboard-ai>Ask StudySpace AI</button></div>
  </section>`);
  document.querySelector("[data-dashboard-ai]")?.addEventListener("click", () => StudySpace.openAI("Help me choose what to study next based on the StudySpace page and my request." , false));
  const biologyCard = [...document.querySelectorAll("#subjectCards a.card")].find(card => card.textContent.includes("Biology 1 Honors"));
  if (biologyCard) {
    biologyCard.href = "biology.html";
    biologyCard.querySelector(".link").textContent = "Start studying →";
    if (!biologyCard.querySelector(".subject-progress")) biologyCard.insertAdjacentHTML("beforeend", `<div class="subject-progress" aria-label="Biology Unit 1 progress">${biologyMastery.map(item => `<span><b>${item.topic}</b> ${StudySpace.escapeHtml(item.label)}</span>`).join("")}</div>`);
  }
  const algebraCard = [...document.querySelectorAll("#subjectCards a.card")].find(card => card.textContent.includes("Algebra 2 Honors"));
  if (algebraCard) {
    algebraCard.href = "algebra2.html";
    algebraCard.querySelector(".link").textContent = "Open Chapter 1 →";
    if (!algebraCard.querySelector(".subject-progress")) algebraCard.insertAdjacentHTML("beforeend", `<div class="subject-progress" aria-label="Algebra 2 Chapter 1 progress">${algebraMastery.map(item => `<span><b>${item.topic}</b> ${StudySpace.escapeHtml(item.label)}</span>`).join("")}</div>`);
  }
}

function upgradeHomeSearch() {
  const input = document.querySelector("#studySearch");
  const results = document.querySelector("#searchResults");
  if (!input || !results || !globalThis.APHG_UNIT1) return;
  const unit = APHG_UNIT1;
  const frameworkPages = { aphg: "aphg.html", algebra2: "algebra2.html", biology: "biology.html" };
  const frameworkIndex = Object.values(globalThis.STUDYSPACE_COURSES?.courses || {}).flatMap(course => course.units.flatMap(courseUnit => [
    { title: `${course.title}: ${courseUnit.title}`, desc: `${courseUnit.summary} ${courseUnit.topics.map(topic => topic.title).join(" ")}`, href: frameworkPages[course.id] || `subject.html?s=${course.id}`, kind: "Official course map" },
    ...courseUnit.topics.map(topic => ({ title: `${course.title} ${topic.id}: ${topic.title}`, desc: topic.summary, href: frameworkPages[course.id] || `subject.html?s=${course.id}`, kind: "Framework topic" }))
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
    { title: "Study This and Import", desc: "Paste material, scan a worksheet, save a set, or use the notebook", href: "study.html", kind: "Tool" },
    { title: "CSIT Essentials", desc: "Hardware notes, flashcards, and practice quiz", href: "csit-essentials.html", kind: "Subject" },
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
    const commandTopic = query.match(/(?:quiz me|practice|quiz).*?(1\.[1-7])/);
    const commands = commandTopic ? [{ title: `Start Topic ${commandTopic[1]} quiz`, desc: "Command", href: `aphg-quiz.html?mode=topic&topic=${commandTopic[1]}`, kind: "Action" }] : /study.*weak/.test(query) ? [{ title: "Study weak topics", desc: "Uses your measured mastery", href: "aphg-flashcards.html?mode=weak", kind: "Action" }] : /study.*mistake/.test(query) ? [{ title: "Study my mistakes", desc: "Builds from missed quiz concepts", href: "aphg-flashcards.html?mode=missed", kind: "Action" }] : [];
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
  const task = new URLSearchParams(location.search).get("focusTask") || sessionStorage.getItem("studyspace-focus-task");
  if (task) sessionStorage.setItem("studyspace-focus-task", task.slice(0, 160));
  const heading = focus.querySelector("h3");
  const status = focus.querySelector("#timerStatus");
  const timer = focus.querySelector("#timer");
  const start = focus.querySelector("#timerStart");
  const reset = focus.querySelector("#timerReset");
  const initialMinutes = Math.min(60, Math.max(1, Number(new URLSearchParams(location.search).get("minutes")) || 25));
  let remaining = initialMinutes * 60;
  let timerId = null;
  const draw = () => { timer.textContent = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`; };
  if (task && heading) heading.textContent = task.slice(0, 80);
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
        <span class="muted">Class of 2030</span>
      </div>
      <div class="team-grid">
        <article class="founder-spotlight">
          <div class="profile-avatar founder-avatar" aria-hidden="true">RS</div>
          <div class="profile-copy">
            <span class="profile-role">Founder &amp; Creator</span>
            <h3>Rajeev Sreenivasachar</h3>
            <p class="profile-year">Freshman • 9th Grade • Class of 2030</p>
            <p>Rajeev founded StudySpace because he believes useful ideas should make it easier for people to learn, grow, and help one another. He brings that same student-first energy to creative projects such as Dosa Hut.</p>
            <div class="profile-values" aria-label="Rajeev's values">
              <span>Helping others</span><span>Student-led</span><span>Creative builder</span>
            </div>
          </div>
        </article>
        <article class="promoter-card">
          <div class="profile-avatar" aria-hidden="true">PV</div>
          <span class="profile-role promoter-role">Promoter</span>
          <h3>Param Vaishya</h3>
          <p class="profile-year">Freshman • 9th Grade • Class of 2030</p>
          <p>Param helps promote StudySpace and introduce more students to its study tools, resources, and AI assistant.</p>
          <div class="profile-values" aria-label="Param's role">
            <span>Student outreach</span><span>Community</span>
          </div>
        </article>
      </div>
    </section>`);
}

function loadChatbot() {
  if (!document.querySelector('link[href="assets/chatbot.css"]')) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "assets/chatbot.css";
    document.head.appendChild(css);
  }
  if (!document.querySelector('script[src="assets/chatbot.js"]')) {
    const script = document.createElement("script");
    script.src = "assets/chatbot.js";
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
      text: "Choose Subjects in the navbar or select a subject card to jump into its study pages. Back links make it easy to move around."
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
      text: "Each subject page groups its available notes, flashcards, and quizzes in one place."
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
      text: "StudySpace was founded by Rajeev Sreenivasachar and is promoted by Param Vaishya to help more students learn with confidence."
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

function setupTour() {
  document.querySelectorAll("[data-start-tour]").forEach(button => {
    button.addEventListener("click", startTour);
  });
  if (localStorage.getItem(TOUR_STORAGE_KEY) !== "complete") {
    const startWhenAiIsReady = attempt => {
      if (document.querySelector(".ssai-toggle") || attempt >= 12) startTour();
      else window.setTimeout(() => startWhenAiIsReady(attempt + 1), 200);
    };
    window.setTimeout(() => startWhenAiIsReady(0), 500);
  }
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
  registerPwa();
});
