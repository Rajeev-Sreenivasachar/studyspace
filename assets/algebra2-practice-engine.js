(function () {
  "use strict";
  const course = globalThis.ALGEBRA2_CHAPTER1;
  const app = globalThis.StudySpace;
  const escape = app.escapeHtml;

  function resultFor(question, picked, correct) {
    return {
      questionId: question.id,
      topic: question.topic,
      concept: question.concept,
      questionType: question.type,
      question: question.prompt,
      picked,
      answer: question.answer,
      explanation: question.explanation,
      mistakeCategory: question.mistakeCategory,
      relatedTerms: [question.concept],
      correct
    };
  }

  function record(question, picked, correct, mode) {
    const result = resultFor(question, picked, correct);
    app.recordQuizAttempt({
      id: `alg-attempt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      subject: "algebra2", unit: "1", mode: mode || "practice", topic: question.topic,
      score: correct ? 1 : 0, total: 1, percentage: correct ? 100 : 0, results: [result]
    });
    return result;
  }

  function controls(question) {
    if (question.inputType === "choice") return `<fieldset class="answer-choices"><legend class="sr-only">Choose an answer</legend>${question.choices.map((choice, index) => `<label><input type="radio" name="algebraAnswer" value="${escape(choice)}"><span><b>${String.fromCharCode(65 + index)}</b>${escape(choice)}</span></label>`).join("")}</fieldset>`;
    return `<label class="math-answer"><span>Your answer</span><input id="algebraAnswerInput" type="text" autocomplete="off" inputmode="text" placeholder="Enter an equation, interval, value, or description"></label>`;
  }

  function mount(container, options = {}) {
    if (!container) return null;
    let question = options.question || course.generate(options.topic || "1.1", { concept: options.concept });
    let hintIndex = 0;
    let recorded = false;
    let recordedCorrect = null;
    let lastPicked = "";

    function value() {
      const selected = container.querySelector('input[name="algebraAnswer"]:checked');
      return selected ? selected.value : container.querySelector("#algebraAnswerInput")?.value?.trim() || "";
    }

    function render() {
      document.body.dataset.skill = question.concept || "";
      container.innerHTML = `<article class="algebra-problem-card" aria-live="polite">
        <div class="problem-meta"><span>Section ${escape(question.topic)}</span><span>${escape(question.concept)}</span><span>${escape(question.difficulty)}</span></div>
        <h3>${escape(question.prompt)}</h3>${controls(question)}
        <div class="problem-actions"><button class="btn primary" type="button" data-check>Check answer</button><button class="btn" type="button" data-hint>Hint 1 of ${question.hints.length}</button><button class="btn plain-action" type="button" data-ai-hint>Ask AI for a hint</button></div>
        <div class="hint-stack" data-hints aria-live="polite"></div><div class="problem-feedback" data-feedback aria-live="assertive"></div>
      </article>`;

      container.querySelector("[data-hint]").onclick = event => {
        if (hintIndex >= question.hints.length) return;
        const hint = document.createElement("p");
        hint.className = "progressive-hint";
        hint.innerHTML = `<strong>Hint ${hintIndex + 1}:</strong> ${escape(question.hints[hintIndex])}`;
        container.querySelector("[data-hints]").appendChild(hint);
        hintIndex += 1;
        event.currentTarget.textContent = hintIndex < question.hints.length ? `Hint ${hintIndex + 1} of ${question.hints.length}` : "All hints shown";
        event.currentTarget.disabled = hintIndex >= question.hints.length;
      };

      container.querySelector("[data-ai-hint]").onclick = () => app.openAI(`Algebra 2 Chapter 1, Section ${question.topic}. Give me one useful hint for this problem without revealing the final answer. Problem: ${question.prompt}`);
      container.querySelector("[data-check]").onclick = () => {
        const picked = value();
        const feedback = container.querySelector("[data-feedback]");
        if (!picked) return void (feedback.innerHTML = `<p class="feedback warning">Choose or enter an answer first.</p>`);
        const correct = question.check(picked);
        lastPicked = picked;
        const shouldRecord = !recorded || (correct && recordedCorrect === false);
        const result = shouldRecord ? record(question, picked, correct, options.mode) : resultFor(question, picked, correct);
        if (shouldRecord) recordedCorrect = correct;
        recorded = true;
        if (correct) {
          feedback.innerHTML = `<div class="feedback correct"><strong>Correct.</strong><p>${escape(question.explanation)}</p></div><div class="problem-actions"><button class="btn" type="button" data-similar>Try a similar problem</button></div>`;
        } else {
          feedback.innerHTML = `<div class="feedback incorrect"><strong>Not yet.</strong><p><b>Likely issue:</b> ${escape(question.mistakeCategory)}</p><p>Your answer: ${escape(picked)}</p></div><div class="problem-actions"><button class="btn" type="button" data-full>Show full solution</button><button class="btn" type="button" data-why>Why is my answer wrong?</button><button class="btn" type="button" data-similar>Try a similar problem</button></div>`;
          feedback.querySelector("[data-full]").onclick = event => {
            event.currentTarget.outerHTML = `<div class="full-solution"><strong>Solution</strong><p>${escape(question.explanation)}</p><p><b>Answer:</b> ${escape(question.answer)}</p></div>`;
          };
          feedback.querySelector("[data-why]").onclick = () => app.openAI(`Algebra 2 Chapter 1, Section ${question.topic}. Diagnose my approach without shaming me. Problem: ${question.prompt}\nMy answer: ${picked}\nExpected answer: ${question.answer}\nKnown mistake category: ${question.mistakeCategory}\nExplain the first wrong step, then give one short similar check question.`);
        }
        feedback.querySelector("[data-similar]").onclick = () => { question = course.generate(question.topic, { concept: question.concept }); hintIndex = 0; recorded = false; recordedCorrect = null; lastPicked = ""; render(); };
        options.onAnswered?.(result, question);
      };
      container.querySelector("#algebraAnswerInput")?.addEventListener("keydown", event => { if (event.key === "Enter") container.querySelector("[data-check]").click(); });
    }

    render();
    return { get question() { return question; }, get lastPicked() { return lastPicked; }, replace(next) { question = next; hintIndex = 0; recorded = false; recordedCorrect = null; render(); } };
  }

  globalThis.AlgebraPracticeEngine = { mount, resultFor };
})();
