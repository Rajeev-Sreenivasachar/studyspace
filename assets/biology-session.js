(function () {
  "use strict";
  const course = globalThis.BIOLOGY_COURSE;
  const app = globalThis.StudySpace;
  const weak = app.weakTopics(course.unit1);
  const topic = weak[0]?.topic || "1.1";
  const sequence = course.sequence(topic);
  const reason = weak.length ? `Sequence ${topic} has your lowest measured score (${weak[0].score}%). This session gives it priority without penalizing mistakes.` : "You do not have enough Biology evidence yet, so the session starts with foundational water properties.";
  document.querySelector("#sessionTopic").textContent = `${topic} ${sequence.title}`;
  document.querySelector("#sessionReason").textContent = reason;
  document.querySelector("#startSession").href = `biology-topic.html?t=${topic}#targets`;
  const steps = [
    ["1", "Quick review", "Review targets and the visual model.", `biology-topic.html?t=${topic}#targets`],
    ["2", "Flashcards", "Rate the key vocabulary honestly.", `biology-flashcards.html?topic=${topic}`],
    ["3", "Scenario practice", "Apply the concept to a new situation.", `biology-topic.html?t=${topic}#elaborate`],
    ["4", "Quiz", "Complete an original targeted check.", `biology-quiz.html?mode=topic&topic=${topic}`],
    ["5", "Review mistakes", "Correct the model behind each miss.", "biology-mistakes.html"],
    ["6", "Mastery update", "See what the new evidence changed.", `biology-topic.html?t=${topic}#mastery`]
  ];
  document.querySelector("#sessionSteps").innerHTML = steps.map(([n, title, detail, href]) => `<a class="session-step" href="${href}"><span>${n}</span><div><h3>${title}</h3><p>${detail}</p></div><em>Open →</em></a>`).join("");
  document.querySelector("#sessionRecap").onclick = () => app.openAI(`Biology study-session recap for sequence ${topic}: ${sequence.title}. Ask me for one concept I can explain, one mistake I corrected, and one remaining question. Then give a short supportive recap based only on my answers.`);
})();
