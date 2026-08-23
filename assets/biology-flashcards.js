(function () {
  "use strict";
  const course = globalThis.BIOLOGY_COURSE;
  const unit = course.unit1;
  const app = globalThis.StudySpace;
  const params = new URLSearchParams(location.search);
  const topicFilter = document.querySelector("#topicFilter");
  const studyMode = document.querySelector("#studyMode");
  const card = document.querySelector("#flashcard");
  let deck = [], index = 0, pointerStart = null;
  course.sequences.forEach(item => topicFilter.insertAdjacentHTML("beforeend", `<option value="${item.id}">${item.id} ${app.escapeHtml(item.title)}</option>`));
  if (params.get("topic")) topicFilter.value = params.get("topic");
  if (["learning", "weak", "missed"].includes(params.get("mode"))) studyMode.value = params.get("mode");
  if (params.get("session")) studyMode.value = app.weakTopics(unit).length ? "weak" : "all";

  function filtered(terms) {
    const state = app.state;
    if (studyMode.value === "learning") return terms.filter(term => state.flashcardMastery[term.id]?.status === "learning");
    if (studyMode.value === "weak") { const weak = new Set(app.weakTopics(unit).map(item => item.topic)); return weak.size ? terms.filter(term => weak.has(term.topic)) : terms; }
    if (studyMode.value === "missed") { const missed = new Set(app.mistakesFor("biology").map(item => String(item.concept).toLowerCase())); return terms.filter(term => [...missed].some(concept => term.term.toLowerCase().includes(concept) || concept.includes(term.term.toLowerCase()))); }
    return terms;
  }
  function buildDeck() { deck = filtered(topicFilter.value === "all" ? course.vocabulary : course.termsForTopic(topicFilter.value)); index = 0; render(); }
  function render() {
    document.querySelector(".flash-empty")?.remove();
    if (!deck.length) { card.hidden = true; document.querySelector("#cardShell").insertAdjacentHTML("beforeend", `<div class="empty-state panel flash-empty"><h2>No cards match this view yet</h2><p class="muted">Try Study All, another sequence, or complete practice to create a mistake deck.</p></div>`); updateStats(); return; }
    card.hidden = false;
    const term = deck[index];
    card.classList.remove("flipped");
    document.querySelector("#cardLabel").textContent = `${index + 1} of ${deck.length}`;
    document.querySelector("#cardTerm").textContent = term.term;
    document.querySelector("#cardTopic").textContent = `Sequence ${term.topic}`;
    document.querySelector("#cardDefinition").textContent = term.definition;
    document.querySelector("#cardExample").textContent = `Example: ${term.example}`;
    document.querySelector("#progress").textContent = `${index + 1} / ${deck.length}`;
    document.querySelector("#topicNotes").href = `biology-topic.html?t=${term.topic}`;
    document.querySelector("#quizMode").href = `biology-quiz.html?mode=topic&topic=${term.topic}`;
    updateStats();
  }
  function updateStats() { const mastery = app.state.flashcardMastery; document.querySelector("#mastered").textContent = course.vocabulary.filter(term => mastery[term.id]?.status === "mastered").length; document.querySelector("#review").textContent = course.vocabulary.filter(term => mastery[term.id]?.status === "learning").length; document.querySelector("#remaining").textContent = course.vocabulary.filter(term => !mastery[term.id]).length; if (!deck.length) document.querySelector("#progress").textContent = "0 / 0"; }
  function move(amount) { if (!deck.length) return; index = (index + amount + deck.length) % deck.length; render(); }
  function rate(status) { if (!deck.length) return; app.recordFlashcard(deck[index], status); move(1); }
  card.onclick = () => card.classList.toggle("flipped");
  card.onpointerdown = event => { pointerStart = event.clientX; };
  card.onpointerup = event => { if (pointerStart === null) return; const delta = event.clientX - pointerStart; pointerStart = null; if (Math.abs(delta) > 60) move(delta > 0 ? -1 : 1); };
  document.addEventListener("keydown", event => { if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return; if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); if (event.code === "Space") { event.preventDefault(); card.classList.toggle("flipped"); } });
  document.querySelector("#prev").onclick = () => move(-1); document.querySelector("#next").onclick = () => move(1); document.querySelector("#know").onclick = () => rate("mastered"); document.querySelector("#again").onclick = () => rate("learning");
  document.querySelector("#shuffle").onclick = () => { for (let cursor = deck.length - 1; cursor > 0; cursor -= 1) { const random = Math.floor(Math.random() * (cursor + 1)); [deck[cursor], deck[random]] = [deck[random], deck[cursor]]; } index = 0; render(); };
  topicFilter.onchange = buildDeck; studyMode.onchange = buildDeck; buildDeck();
})();
