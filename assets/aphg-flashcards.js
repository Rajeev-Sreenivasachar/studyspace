(function () {
  "use strict";
  const unit = globalThis.APHG_UNIT1;
  const app = globalThis.StudySpace;
  const params = new URLSearchParams(location.search);
  const topicFilter = document.querySelector("#topicFilter");
  const studyMode = document.querySelector("#studyMode");
  const card = document.querySelector("#flashcard");
  let deck = [];
  let index = 0;
  let pointerStart = null;

  unit.topics.forEach(topic => topicFilter.insertAdjacentHTML("beforeend", `<option value="${topic.id}">${topic.id} ${app.escapeHtml(topic.title)}</option>`));
  if (params.get("topic")) topicFilter.value = params.get("topic");
  if (["learning", "weak", "missed"].includes(params.get("mode"))) studyMode.value = params.get("mode");
  if (params.get("session")) studyMode.value = app.weakTopics(unit).length ? "weak" : "all";

  function dedupe(terms) {
    const seen = new Set();
    return terms.filter(term => {
      const key = term.term.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function termsForMode(terms) {
    const state = app.state;
    if (studyMode.value === "learning") return terms.filter(term => state.flashcardMastery[term.id]?.status === "learning");
    if (studyMode.value === "weak") {
      const weak = new Set(app.weakTopics(unit).map(topic => topic.topic));
      return weak.size ? terms.filter(term => weak.has(term.topic)) : terms;
    }
    if (studyMode.value === "missed") {
      const names = new Set(state.quizAttempts.flatMap(attempt => attempt.results || []).filter(result => !result.correct).flatMap(result => result.relatedTerms || []).map(name => name.toLowerCase()));
      return terms.filter(term => [...names].some(name => term.term.toLowerCase().includes(name) || name.includes(term.term.toLowerCase())));
    }
    return terms;
  }

  function buildDeck() {
    let terms = topicFilter.value === "all" ? unit.vocabulary : unit.termsForTopic(topicFilter.value);
    terms = termsForMode(dedupe(terms));
    const session = params.get("session");
    if (session === "quick") terms = terms.slice(0, 8);
    deck = [...terms];
    index = 0;
    render();
  }

  function renderEmpty() {
    card.hidden = true;
    document.querySelector("#cardShell").insertAdjacentHTML("beforeend", `<div class="empty-state panel flash-empty"><h2>No cards match this view yet</h2><p class="muted">${studyMode.value === "learning" ? "Mark a card Still Learning to add it here." : studyMode.value === "missed" ? "Complete a quiz and miss a related assigned concept to build this deck." : topicFilter.value === "1.6" ? "The available 1–17 assignment has no numbered Topic 1.6 term. Use the teacher notes and Topic Quiz instead." : "Try Study All or another topic."}</p></div>`);
  }

  function render() {
    document.querySelector(".flash-empty")?.remove();
    if (!deck.length) {
      renderEmpty();
      updateStats();
      return;
    }
    card.hidden = false;
    const term = deck[index];
    card.classList.remove("flipped");
    document.querySelector("#cardLabel").textContent = `Assignment ${term.number} · ${index + 1} of ${deck.length}`;
    document.querySelector("#cardTerm").textContent = term.term;
    document.querySelector("#cardTopic").textContent = `Topic ${term.topic}`;
    document.querySelector("#cardDefinition").textContent = term.definition;
    document.querySelector("#cardSimple").textContent = `StudySpace explanation: ${term.simpleExplanation}`;
    document.querySelector("#cardExample").textContent = `Example: ${term.example}`;
    document.querySelector("#cardHook").textContent = `Memory hook: ${term.hook}`;
    document.querySelector("#progress").textContent = `${index + 1} / ${deck.length}`;
    document.querySelector("#topicNotes").href = `aphg-topic.html?t=${term.topic}`;
    document.querySelector("#quizMode").href = `aphg-quiz.html?topic=${term.topic}&mode=topic`;
    updateStats();
  }

  function updateStats() {
    const mastery = app.state.flashcardMastery;
    const all = unit.vocabulary;
    document.querySelector("#mastered").textContent = all.filter(term => mastery[term.id]?.status === "mastered").length;
    document.querySelector("#review").textContent = all.filter(term => mastery[term.id]?.status === "learning").length;
    document.querySelector("#remaining").textContent = all.filter(term => !mastery[term.id]).length;
    if (!deck.length) document.querySelector("#progress").textContent = "0 / 0";
  }

  function move(amount) {
    if (!deck.length) return;
    index = (index + amount + deck.length) % deck.length;
    render();
  }

  function rate(status) {
    if (!deck.length) return;
    app.recordFlashcard(deck[index], status);
    move(1);
  }

  card.onclick = () => card.classList.toggle("flipped");
  card.onpointerdown = event => { pointerStart = event.clientX; };
  card.onpointerup = event => {
    if (pointerStart === null) return;
    const delta = event.clientX - pointerStart;
    pointerStart = null;
    if (Math.abs(delta) > 60) move(delta > 0 ? -1 : 1);
  };
  document.addEventListener("keydown", event => {
    if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
    if (event.key === "ArrowRight") move(1);
    if (event.key === "ArrowLeft") move(-1);
    if (event.code === "Space") { event.preventDefault(); card.classList.toggle("flipped"); }
  });
  document.querySelector("#prev").onclick = () => move(-1);
  document.querySelector("#next").onclick = () => move(1);
  document.querySelector("#know").onclick = () => rate("mastered");
  document.querySelector("#again").onclick = () => rate("learning");
  document.querySelector("#shuffle").onclick = () => {
    for (let cursor = deck.length - 1; cursor > 0; cursor -= 1) {
      const random = Math.floor(Math.random() * (cursor + 1));
      [deck[cursor], deck[random]] = [deck[random], deck[cursor]];
    }
    index = 0;
    render();
  };
  topicFilter.onchange = buildDeck;
  studyMode.onchange = buildDeck;
  buildDeck();
})();
