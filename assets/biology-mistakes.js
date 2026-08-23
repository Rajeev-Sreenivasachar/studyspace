(function () {
  "use strict";
  const course = globalThis.BIOLOGY_COURSE;
  const app = globalThis.StudySpace;
  const topic = document.querySelector("#mistakeTopic");
  const search = document.querySelector("#mistakeSearch");
  course.sequences.forEach(item => topic.insertAdjacentHTML("beforeend", `<option value="${item.id}">${item.id} ${app.escapeHtml(item.title)}</option>`));
  function render() {
    const q = search.value.trim().toLowerCase();
    const mistakes = app.mistakesFor("biology").filter(item => (topic.value === "all" || item.topic === topic.value) && (!q || `${item.concept} ${item.question} ${item.explanation}`.toLowerCase().includes(q)));
    document.querySelector("#mistakeCount").textContent = `${mistakes.length} saved Biology mistake${mistakes.length === 1 ? "" : "s"}`;
    document.querySelector("#mistakeList").innerHTML = mistakes.length ? mistakes.map(item => `<article class="mistake-card"><div class="mistake-head"><div><span class="eyebrow">Sequence ${app.escapeHtml(item.topic)} · ${app.escapeHtml(item.questionType)}</span><h3>${app.escapeHtml(item.concept)}</h3></div><time>${new Date(item.timestamp).toLocaleDateString()}</time></div><p><strong>Question:</strong> ${app.escapeHtml(item.question)}</p><p class="wrong-answer"><strong>Your answer:</strong> ${app.escapeHtml(item.wrongAnswer)}</p><p><strong>Correct concept:</strong> ${app.escapeHtml(item.correctAnswer)}</p><p class="muted">${app.escapeHtml(item.explanation)}</p><div class="actions"><a class="btn small" href="biology-quiz.html?mode=topic&topic=${item.topic}&concept=${encodeURIComponent(item.concept)}">Give Me a Similar Question</a><button class="btn small" type="button" data-explain="${app.escapeHtml(item.id)}">Explain Why I Missed It</button></div></article>`).join("") : `<div class="empty-state panel"><h2>No Biology mistakes yet</h2><p class="muted">Complete a Biology practice quiz. Missed questions will appear here with explanations and retry actions.</p></div>`;
    document.querySelectorAll("[data-explain]").forEach(button => button.onclick = () => { const item = mistakes.find(entry => entry.id === button.dataset.explain); if (item) app.openAI(`Biology mistake review. Sequence ${item.topic}; concept ${item.concept}. Question: ${item.question} My answer: ${item.wrongAnswer}. Correct answer: ${item.correctAnswer}. Explain the likely misconception without judging me, describe a model, then ask one similar question.`); });
  }
  topic.onchange = render; search.oninput = render; render();
})();
