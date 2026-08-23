(function () {
  "use strict";
  const unit = globalThis.APHG_UNIT1;
  const bank = globalThis.APHG_QUESTIONS;
  const app = globalThis.StudySpace;
  const builder = document.querySelector("#quizBuilder");
  const shell = document.querySelector("#quizShell");
  const message = document.querySelector("#builderMessage");
  const params = new URLSearchParams(location.search);
  let questions = [];
  let current = 0;
  let score = 0;
  let answered = false;
  let results = [];
  let activeMode = "quick";

  const shuffle = array => {
    const copy = [...array];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const random = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[random]] = [copy[random], copy[index]];
    }
    return copy;
  };
  const escape = value => app.escapeHtml(value);
  const types = [...new Set(bank.map(question => question.type))];

  document.querySelector("#bankCount").textContent = `${bank.length} questions`;
  document.querySelector("#topicChoices").innerHTML = unit.topics.map(topic => `<label><input type="checkbox" name="topic" value="${topic.id}" ${params.get("topic") === topic.id ? "checked" : ""}> ${topic.id} ${escape(topic.title)}</label>`).join("");
  document.querySelector("#typeChoices").innerHTML = types.map(type => `<label><input type="checkbox" name="type" value="${type}" checked> ${escape(type.replace("-", " "))}</label>`).join("");
  if (params.get("mode")) document.querySelector(`input[name="mode"][value="${params.get("mode")}"]`)?.setAttribute("checked", "checked");

  function selected(name) { return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value); }

  function mistakePool() {
    const missed = app.state.quizAttempts.flatMap(attempt => attempt.results || []).filter(result => !result.correct);
    const missedIds = new Set(missed.map(result => result.questionId));
    const topics = new Set(missed.map(result => result.topic));
    const alternatives = bank.filter(question => topics.has(question.topic) && !missedIds.has(question.id));
    return alternatives.length ? alternatives : bank.filter(question => missedIds.has(question.id));
  }

  function buildPool(mode) {
    let pool = [...bank];
    const topics = selected("topic");
    const selectedTypes = selected("type");
    const difficulty = document.querySelector("#difficulty").value;
    if (mode === "topic") {
      if (!topics.length) throw new Error("Choose at least one topic for a Topic Quiz.");
      pool = pool.filter(question => topics.includes(question.topic));
    }
    if (mode === "weak") {
      const weak = app.weakTopics(unit).map(item => item.topic);
      if (!weak.length) throw new Error("Not enough mastery data yet. Complete a regular quiz or flashcard round first.");
      pool = pool.filter(question => weak.includes(question.topic));
    }
    if (mode === "mistakes") {
      pool = mistakePool();
      if (!pool.length) throw new Error("No missed concepts yet. Complete a quiz first.");
    }
    if (difficulty !== "all") pool = pool.filter(question => question.difficulty === difficulty);
    if (selectedTypes.length) pool = pool.filter(question => selectedTypes.includes(question.type));
    if (!pool.length) throw new Error("No questions match those filters. Try mixed difficulty or more question types.");
    return pool;
  }

  function selectQuestions(mode) {
    const pool = buildPool(mode);
    const wanted = mode === "quick" ? 10 : mode === "standard" ? 20 : mode === "full" ? 30 : mode === "topic" ? Math.min(15, pool.length) : Math.min(12, pool.length);
    if (mode === "full") {
      const balanced = unit.topics.flatMap(topic => shuffle(pool.filter(question => question.topic === topic.id)).slice(0, 4));
      return shuffle([...balanced, ...shuffle(pool.filter(question => !balanced.includes(question)))]).slice(0, Math.min(wanted, pool.length));
    }
    return shuffle(pool).slice(0, Math.min(wanted, pool.length));
  }

  function startQuiz(modeOverride) {
    message.textContent = "";
    try {
      activeMode = modeOverride || document.querySelector('input[name="mode"]:checked').value;
      questions = selectQuestions(activeMode).map(question => ({ ...question, shuffledChoices: shuffle(question.choices) }));
    } catch (error) {
      message.textContent = error.message;
      return;
    }
    current = 0;
    score = 0;
    results = [];
    builder.hidden = true;
    shell.hidden = false;
    renderQuestion();
    shell.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderQuestion() {
    answered = false;
    const question = questions[current];
    shell.innerHTML = `<article class="quiz-card"><div class="quiz-top"><span>Question ${current + 1} of ${questions.length}</span><strong>Score: ${score}</strong></div><div class="question-tags"><span>Topic ${question.topic}</span><span>${escape(question.type)}</span><span>${escape(question.difficulty)}</span></div><h2>${escape(question.question)}</h2><div class="choices">${question.shuffledChoices.map((choice, index) => `<button class="btn choice" type="button" data-choice="${index}">${escape(choice)}</button>`).join("")}</div><div class="feedback" id="feedback" aria-live="polite"></div><div class="answer-explanation" id="answerExplanation" hidden></div><button class="btn primary" id="continue" type="button" hidden>${current === questions.length - 1 ? "See results" : "Next question →"}</button></article>`;
    shell.querySelectorAll("[data-choice]").forEach(button => button.onclick = () => answer(Number(button.dataset.choice)));
    document.querySelector("#continue").onclick = () => {
      current += 1;
      if (current === questions.length) finish();
      else renderQuestion();
    };
  }

  function answer(choiceIndex) {
    if (answered) return;
    answered = true;
    const question = questions[current];
    const picked = question.shuffledChoices[choiceIndex];
    const correct = picked === question.answer;
    if (correct) score += 1;
    results.push({ questionId: question.id, topic: question.topic, question: question.question, picked, answer: question.answer, explanation: question.explanation, relatedTerms: question.relatedTerms, correct });
    shell.querySelectorAll("[data-choice]").forEach((button, index) => {
      button.disabled = true;
      if (question.shuffledChoices[index] === question.answer) button.classList.add("correct");
      else if (index === choiceIndex) button.classList.add("wrong");
    });
    const feedback = document.querySelector("#feedback");
    feedback.className = `feedback ${correct ? "good" : "bad"}`;
    feedback.textContent = correct ? "Correct — explain why before moving on." : `Not quite. The best answer is: ${question.answer}`;
    const explanation = document.querySelector("#answerExplanation");
    explanation.hidden = false;
    explanation.innerHTML = `<strong>Why:</strong> ${escape(question.explanation)}<small>Topic ${question.topic} · Related: ${escape(question.relatedTerms.join(", "))}</small>`;
    document.querySelector("#continue").hidden = false;
  }

  function finish() {
    const percentage = Math.round(score / questions.length * 100);
    app.recordQuizAttempt({ subject: "aphg", unit: "1", mode: activeMode, topic: selected("topic").join(",") || null, score, total: questions.length, percentage, results });
    const missed = results.filter(result => !result.correct);
    shell.innerHTML = `<section class="quiz-results"><div class="results-hero"><div class="eyebrow">Quiz complete</div><h2>${percentage}%</h2><p>${score} of ${questions.length} correct · ${missed.length} concept${missed.length === 1 ? "" : "s"} to review</p></div><div class="results-actions"><a class="btn primary" href="aphg-flashcards.html?mode=missed">Study My Mistakes</a><button class="btn" id="retryMissed" type="button" ${missed.length ? "" : "disabled"}>Retry Missed Concepts</button><button class="btn" id="newQuiz" type="button">Build another quiz</button></div><div class="result-review"><h2>Answer review</h2>${results.map((result, index) => `<article class="result-item ${result.correct ? "correct" : "incorrect"}"><div class="result-mark" aria-label="${result.correct ? "Correct" : "Incorrect"}">${result.correct ? "✓" : "×"}</div><div><h3>${index + 1}. ${escape(result.question)}</h3><p><strong>Your answer:</strong> ${escape(result.picked)}</p>${result.correct ? "" : `<p><strong>Correct answer:</strong> ${escape(result.answer)}</p>`}<p>${escape(result.explanation)}</p><small>Topic ${result.topic} · ${escape(result.relatedTerms.join(", "))}</small></div></article>`).join("")}</div></section>`;
    document.querySelector("#retryMissed").onclick = () => startQuiz("mistakes");
    document.querySelector("#newQuiz").onclick = () => { shell.hidden = true; builder.hidden = false; builder.scrollIntoView({ behavior: "smooth" }); };
  }

  document.querySelector("#startQuiz").onclick = () => startQuiz();
  if (params.get("mode") === "topic" && params.get("topic")) startQuiz("topic");
})();
