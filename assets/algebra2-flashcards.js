(function () {
  "use strict";
  const data = globalThis.ALGEBRA2_CHAPTER1;
  const app = globalThis.StudySpace;
  const $ = selector => document.querySelector(selector);
  const params = new URLSearchParams(location.search);
  let deck = [];
  let index = 0;
  let flipped = false;

  data.sections.forEach(section => $("#topicFilter").insertAdjacentHTML("beforeend", `<option value="${section.id}">${section.id} ${app.escapeHtml(section.title)}</option>`));
  if (params.get("section")) $("#topicFilter").value = params.get("section");
  if (params.get("mode")) $("#studyMode").value = params.get("mode");

  function filtered() {
    const topic = $("#topicFilter").value;
    const mode = $("#studyMode").value;
    const state = app.state;
    const mistakes = new Set(app.mistakesFor("algebra2").map(item => String(item.concept).toLowerCase()));
    return data.flashcards.filter(card => topic === "all" || card.topic === topic).filter(card => {
      const saved = state.flashcardMastery[card.id];
      if (mode === "learning") return saved?.status === "learning";
      if (mode === "weak") return app.conceptMastery("algebra2", card.concept).label === "Learning";
      if (mode === "missed") return mistakes.has(String(card.concept).toLowerCase());
      return true;
    });
  }

  function render() {
    if (!deck.length) {
      $("#flashcard").hidden = true;
      if (!$("#flashEmpty")) $("#cardShell").insertAdjacentHTML("beforeend", `<div class="empty-state" id="flashEmpty"><h2>No cards match this filter.</h2><p>Try Study all or another section.</p></div>`);
      document.querySelectorAll(".flash-controls button").forEach(button => button.disabled = true);
      return;
    }
    $("#flashcard").hidden = false;
    $("#flashEmpty")?.remove();
    document.querySelectorAll(".flash-controls button").forEach(button => button.disabled = false);
    const card = deck[index];
    $("#flashcard").classList.toggle("flipped", flipped);
    $("#cardLabel").textContent = flipped ? "Rule / meaning" : card.concept;
    $("#cardTerm").textContent = card.term;
    $("#cardTopic").textContent = `Section ${card.topic}`;
    $("#cardDefinition").textContent = card.definition;
    $("#cardExample").textContent = `Example: ${card.example}`;
    $("#progress").textContent = `${index + 1} / ${deck.length}`;
    const mastery = app.state.flashcardMastery;
    $("#mastered").textContent = data.flashcards.filter(card => mastery[card.id]?.status === "mastered").length;
    $("#review").textContent = data.flashcards.filter(card => mastery[card.id]?.status === "learning").length;
    $("#remaining").textContent = data.flashcards.filter(card => !mastery[card.id]).length;
    $("#topicNotes").href = `algebra2-section.html?s=${card.topic}`;
    $("#practiceMode").href = `algebra2-practice.html?section=${card.topic}`;
  }

  function refresh() { deck = filtered(); index = 0; flipped = false; render(); }
  function move(amount) { if (!deck.length) return; index = (index + amount + deck.length) % deck.length; flipped = false; render(); }
  $("#flashcard").onclick = () => { flipped = !flipped; render(); };
  $("#flashcard").onkeydown = event => { if ([" ", "Enter"].includes(event.key)) { event.preventDefault(); $("#flashcard").click(); } };
  $("#prev").onclick = () => move(-1); $("#next").onclick = () => move(1);
  $("#again").onclick = () => { app.recordFlashcard(deck[index], "learning"); move(1); };
  $("#know").onclick = () => { app.recordFlashcard(deck[index], "mastered"); move(1); };
  $("#shuffle").onclick = () => { deck.sort(() => Math.random() - 0.5); index = 0; render(); };
  $("#topicFilter").onchange = refresh; $("#studyMode").onchange = refresh;
  refresh();
})();
