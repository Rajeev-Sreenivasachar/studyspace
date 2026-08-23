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
        <a href="index.html#founder">Our story</a>
        <a href="index.html#focus">Focus timer</a>
        <button class="nav-tour" type="button" data-start-tour>Take a tour</button>
        ${back ? `<a href="${back}">Back</a>` : ""}
      </div>
    </nav>`;
}

function footer() {
  return `<footer>StudySpace • founded by Rajeev Sreenivasachar • built to help students lock in</footer>`;
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
  loadChatbot();
  setupTour();
});
