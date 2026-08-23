(function () {
  "use strict";
  const course = globalThis.BIOLOGY_COURSE;
  const unit = course.unit1;
  const bank = globalThis.BIOLOGY_QUESTIONS;
  const app = globalThis.StudySpace;
  const builder = document.querySelector("#quizBuilder");
  const shell = document.querySelector("#quizShell");
  const message = document.querySelector("#builderMessage");
  const params = new URLSearchParams(location.search);
  let questions = [], current = 0, score = 0, answered = false, results = [], activeMode = "quick";
  const shuffle = array => { const copy = [...array]; for (let i = copy.length - 1; i > 0; i -= 1) { const r = Math.floor(Math.random() * (i + 1)); [copy[i], copy[r]] = [copy[r], copy[i]]; } return copy; };
  const escape = app.escapeHtml;
  const types = [...new Set(bank.map(question => question.type))];
  document.querySelector("#bankCount").textContent = `${bank.length} original questions`;
  document.querySelector("#topicChoices").innerHTML = course.sequences.map(item => `<label><input type="checkbox" name="topic" value="${item.id}" ${params.get("topic") === item.id ? "checked" : ""}> ${item.id} ${escape(item.title)}</label>`).join("");
  document.querySelector("#typeChoices").innerHTML = types.map(type => `<label><input type="checkbox" name="type" value="${escape(type)}" checked> ${escape(type)}</label>`).join("");
  if (params.get("mode")) document.querySelector(`input[name="mode"][value="${params.get("mode")}"]`)?.setAttribute("checked", "checked");
  function selected(name) { return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value); }
  function mistakePool() {
    const mistakes = app.mistakesFor("biology");
    const concepts = new Set(mistakes.map(item => String(item.concept).toLowerCase()));
    const exact = new Set(mistakes.map(item => item.questionId));
    const similar = bank.filter(question => concepts.has(String(question.concept).toLowerCase()) && !exact.has(question.id));
    return similar.length ? similar : bank.filter(question => exact.has(question.id));
  }
  function buildPool(mode) {
    let pool = [...bank];
    const topics = selected("topic");
    const chosenTypes = selected("type");
    const difficulty = document.querySelector("#difficulty").value;
    const concept = params.get("concept");
    if (mode === "topic") { if (!topics.length) throw new Error("Choose at least one instructional sequence."); pool = pool.filter(question => topics.includes(question.topic)); }
    if (mode === "weak") { const weak = app.weakTopics(unit).map(item => item.topic); if (!weak.length) throw new Error("Not enough Biology mastery data yet. Complete a regular practice or flashcard round first."); pool = pool.filter(question => weak.includes(question.topic)); }
    if (mode === "mistakes") { pool = mistakePool(); if (!pool.length) throw new Error("No saved Biology mistakes yet. Complete a practice quiz first."); }
    if (concept) { const exact = pool.filter(question => question.concept.toLowerCase() === concept.toLowerCase()); if (exact.length) pool = exact; }
    if (difficulty !== "all") pool = pool.filter(question => question.difficulty === difficulty);
    if (chosenTypes.length) pool = pool.filter(question => chosenTypes.includes(question.type));
    if (!pool.length) throw new Error("No questions match those filters. Try mixed difficulty or more question types.");
    return pool;
  }
  function selectQuestions(mode) { const pool = buildPool(mode); const wanted = mode === "quick" ? 8 : mode === "standard" ? 15 : mode === "full" ? 25 : Math.min(10, pool.length); if (mode === "full") { const balanced = course.sequences.flatMap(item => shuffle(pool.filter(q => q.topic === item.id)).slice(0, 5)); return shuffle([...balanced, ...pool.filter(q => !balanced.includes(q))]).slice(0, Math.min(wanted, pool.length)); } return shuffle(pool).slice(0, Math.min(wanted, pool.length)); }
  function startQuiz(override) {
    message.textContent = "";
    try { activeMode = override || document.querySelector('input[name="mode"]:checked').value; questions = selectQuestions(activeMode).map(question => ({ ...question, shuffledChoices: shuffle(question.choices) })); }
    catch (error) { message.textContent = error.message; return; }
    current = 0; score = 0; results = []; builder.hidden = true; shell.hidden = false; renderQuestion(); shell.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function renderQuestion() {
    answered = false;
    const question = questions[current];
    shell.innerHTML = `<article class="quiz-card"><div class="quiz-top"><span>Question ${current + 1} of ${questions.length}</span><strong>Score: ${score}</strong></div><div class="question-tags"><span>Sequence ${question.topic}</span><span>${escape(question.concept)}</span><span>${escape(question.type)}</span><span>${escape(question.difficulty)}</span></div><h2>${escape(question.question)}</h2><div class="choices">${question.shuffledChoices.map((choice, index) => `<button class="btn choice" type="button" data-choice="${index}">${escape(choice)}</button>`).join("")}</div><div class="feedback" id="feedback" aria-live="polite"></div><div class="answer-explanation" id="answerExplanation" hidden></div><button class="btn primary" id="continue" type="button" hidden>${current === questions.length - 1 ? "See results" : "Next question →"}</button></article>`;
    shell.querySelectorAll("[data-choice]").forEach(button => button.onclick = () => answer(Number(button.dataset.choice)));
    document.querySelector("#continue").onclick = () => { current += 1; if (current === questions.length) finish(); else renderQuestion(); };
  }
  function answer(choiceIndex) {
    if (answered) return; answered = true;
    const question = questions[current], picked = question.shuffledChoices[choiceIndex], correct = picked === question.answer;
    if (correct) score += 1;
    results.push({ questionId: question.id, topic: question.topic, concept: question.concept, questionType: question.type, question: question.question, picked, answer: question.answer, explanation: question.explanation, relatedTerms: question.relatedTerms, correct });
    shell.querySelectorAll("[data-choice]").forEach((button, index) => { button.disabled = true; if (question.shuffledChoices[index] === question.answer) button.classList.add("correct"); else if (index === choiceIndex) button.classList.add("wrong"); });
    const feedback = document.querySelector("#feedback"); feedback.className = `feedback ${correct ? "good" : "bad"}`; feedback.textContent = correct ? "Correct — connect the answer to the scientific model." : `Not quite. The best answer is: ${question.answer}`;
    const explanation = document.querySelector("#answerExplanation"); explanation.hidden = false; explanation.innerHTML = `<strong>Why:</strong> ${escape(question.explanation)}<small>Sequence ${question.topic} · Concept: ${escape(question.concept)}</small>`;
    document.querySelector("#continue").hidden = false;
  }
  function finish() {
    const percentage = Math.round(score / questions.length * 100);
    app.recordQuizAttempt({ subject: "biology", unit: "1", mode: activeMode, topic: selected("topic").join(",") || null, score, total: questions.length, percentage, results });
    const missed = results.filter(result => !result.correct);
    shell.innerHTML = `<section class="quiz-results"><div class="results-hero"><div class="eyebrow">Mastery check complete</div><h2>${percentage}%</h2><p>${score} of ${questions.length} correct · ${missed.length} concept${missed.length === 1 ? "" : "s"} added to useful review</p></div><div class="results-actions"><a class="btn primary" href="biology-mistakes.html">Review My Mistakes</a><button class="btn" id="retryMissed" type="button" ${missed.length ? "" : "disabled"}>Give Me Similar Questions</button><button class="btn" id="newQuiz" type="button">Build another practice</button></div><div class="result-review"><h2>Answer review</h2>${results.map((result, index) => `<article class="result-item ${result.correct ? "correct" : "incorrect"}"><div class="result-mark" aria-label="${result.correct ? "Correct" : "Incorrect"}">${result.correct ? "✓" : "×"}</div><div><h3>${index + 1}. ${escape(result.question)}</h3><p><strong>Your answer:</strong> ${escape(result.picked)}</p>${result.correct ? "" : `<p><strong>Correct answer:</strong> ${escape(result.answer)}</p>`}<p>${escape(result.explanation)}</p><small>Sequence ${result.topic} · ${escape(result.concept)}</small></div></article>`).join("")}</div></section>`;
    document.querySelector("#retryMissed").onclick = () => startQuiz("mistakes");
    document.querySelector("#newQuiz").onclick = () => { shell.hidden = true; builder.hidden = false; builder.scrollIntoView({ behavior: "smooth" }); };
  }
  document.querySelector("#startQuiz").onclick = () => startQuiz();
  if (params.get("mode") === "topic" && params.get("topic")) startQuiz("topic");
  if (params.get("mode") === "mistakes") startQuiz("mistakes");
})();
