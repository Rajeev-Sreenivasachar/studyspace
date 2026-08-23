(function () {
  "use strict";
  const course = globalThis.BIOLOGY_COURSE;
  const app = globalThis.StudySpace;
  const id = new URLSearchParams(location.search).get("t") || "1.1";
  const sequence = course.sequence(id) || course.sequence("1.1");
  const escape = app.escapeHtml;
  const mastery = app.topicMastery(sequence.id, course.unit1);
  const terms = course.termsForTopic(sequence.id);
  const material = course.materials.find(item => item.sequence === sequence.id);
  document.title = `${sequence.id} ${sequence.title} | Biology | StudySpace`;
  document.body.dataset.subject = "biology";
  document.body.dataset.unit = "1";
  document.body.dataset.sequence = sequence.id;

  document.querySelector("#sequenceEyebrow").textContent = `Biology 1 Honors • Unit 1 • Sequence ${sequence.id}`;
  document.querySelector("#sequenceTitle").textContent = `${sequence.id} ${sequence.title}`;
  document.querySelector("#sequenceSummary").textContent = sequence.summary;
  document.querySelector("#sequenceCards").href = `biology-flashcards.html?topic=${sequence.id}`;
  document.querySelector("#sequenceQuiz").href = `biology-quiz.html?mode=topic&topic=${sequence.id}`;
  document.querySelector("#evaluateQuiz").href = `biology-quiz.html?mode=topic&topic=${sequence.id}`;
  document.querySelector("#sequenceMastery").textContent = mastery.score === null ? mastery.label : `${mastery.label} · ${mastery.score}%`;
  document.querySelector("#sequenceMastery").classList.add(mastery.label.toLowerCase().replaceAll(" ", "-"));
  if (sequence.standard) { document.querySelector("#sequenceStandard").hidden = false; document.querySelector("#sequenceStandard").textContent = sequence.standard; }
  document.querySelector(".biology-topic-head .actions").insertAdjacentHTML("beforeend", `<a class="btn" href="biology-material.html?id=${material.id}">Class source</a>`);

  document.querySelector("#learningTargets").innerHTML = sequence.learningTargets.map(item => `<li>${escape(item)}</li>`).join("");
  document.querySelector("#preClassGrid").innerHTML = [["Reading / slides", sequence.preClass.reading], ["Short check", sequence.preClass.check], ["Teacher materials", sequence.preClass.materials]].map(([title, text]) => `<article><h3>${escape(title)}</h3><p>${escape(text)}</p></article>`).join("");
  document.querySelector("#engageGrid").innerHTML = [["Hook", sequence.engage.hook], ["Prior knowledge", sequence.engage.prior], ["Scenario question", sequence.engage.scenario]].map(([title, text]) => `<article><h3>${escape(title)}</h3><p>${escape(text)}</p></article>`).join("");
  document.querySelector("#exploreGrid").innerHTML = sequence.explore.map(item => `<article><h3>${escape(item.title)}</h3><p>${escape(item.detail)}</p><button class="plain-action" type="button" data-explore-help="${escape(item.title)}">Ask about this activity</button></article>`).join("");
  document.querySelector("#biologyNotes").innerHTML = sequence.sections.map(section => `<article class="note-section biology-note"><h2>${escape(section.title)}</h2><p>${escape(section.summary)}</p><ul>${section.keyIdeas.map(idea => `<li>${escape(idea)}</li>`).join("")}</ul></article>`).join("");

  const special = document.querySelector("#specialContent");
  if (sequence.comparison) special.innerHTML = `<section class="biology-special"><h2>Compare all four macromolecules</h2><div class="table-scroll"><table><thead><tr><th>Group</th><th>Elements</th><th>Building block</th><th>Large form</th><th>Major functions</th><th>Examples</th></tr></thead><tbody>${sequence.comparison.map(row => `<tr>${row.map(cell => `<td>${escape(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
  if (sequence.organelles) special.innerHTML = `<section class="biology-special"><h2>Organelle function map</h2><div class="organelle-grid">${sequence.organelles.map(([name, fn, found]) => `<article><div class="cell-icon" aria-hidden="true">${escape(name.slice(0, 1))}</div><h3>${escape(name)}</h3><p>${escape(fn)}</p><small>Found in: ${escape(found)}</small><button class="plain-action" type="button" data-organelle="${escape(name)}">Practice this organelle</button></article>`).join("")}</div></section>`;
  if (sequence.microscopeParts) special.innerHTML = `<section class="biology-special"><h2>Compound microscope parts</h2><p class="muted">Use the function clues to label a classroom microscope model.</p><div class="organelle-grid">${sequence.microscopeParts.map(([name, fn]) => `<article><div class="cell-icon" aria-hidden="true">${escape(name.slice(0, 1))}</div><h3>${escape(name)}</h3><p>${escape(fn)}</p><button class="plain-action" type="button" data-microscope-part="${escape(name)}">Practice this label</button></article>`).join("")}</div></section>`;

  document.querySelector("#biologyVisuals").innerHTML = sequence.visuals.map(visual => `<article class="biology-visual ${escape(visual.type)}"><div class="eyebrow">Visual model</div><h3>${escape(visual.title)}</h3><div class="visual-flow">${visual.items.map((item, index) => `<div><span>${index + 1}</span><p>${escape(item)}</p></div>`).join("")}</div></article>`).join("");
  document.querySelector("#elaborateGrid").innerHTML = sequence.elaborate.map((prompt, index) => `<article><span class="topic-number">${index + 1}</span><p>${escape(prompt)}</p><button type="button" class="plain-action" data-apply="${index}">Work through this with AI</button></article>`).join("");
  document.querySelector("#cerCard").innerHTML = `<div class="eyebrow">CER practice</div><h3>${escape(sequence.cer.prompt)}</h3><div class="cer-grid"><p><strong>Claim</strong>${escape(sequence.cer.claim)}</p><p><strong>Evidence</strong>${escape(sequence.cer.evidence)}</p><p><strong>Reasoning</strong>${escape(sequence.cer.reasoning)}</p></div><button class="btn small" type="button" id="cerCoach">Coach my CER</button>`;
  document.querySelector("#biologyPractice").innerHTML = sequence.practice.map((item, index) => `<details class="practice-question"><summary><span>${index + 1}</span><div><small>${escape(item.type)}</small><br>${escape(item.prompt)}</div></summary><p><strong>Model answer:</strong> ${escape(item.answer)}</p></details>`).join("");
  document.querySelector("#conceptMastery").innerHTML = sequence.masteryTags.map(concept => { const result = app.conceptMastery("biology", concept); const className = result.label.toLowerCase().replaceAll(" ", "-"); return `<article class="concept-mastery ${className}"><div><span>${escape(concept)}</span><strong>${result.score === null ? "—" : `${result.score}%`}</strong></div><p class="mastery-chip ${className}">${escape(result.label)}</p><a href="biology-quiz.html?mode=topic&topic=${sequence.id}&concept=${encodeURIComponent(concept)}">Practice concept →</a></article>`; }).join("");
  document.querySelector("#biologyVocabulary").innerHTML = terms.map(term => `<article class="term"><div class="term-num">SEQUENCE ${sequence.id}</div><h3>${escape(term.term)}</h3><p>${escape(term.definition)}</p><p class="example"><strong>Example:</strong> ${escape(term.example)}</p><button class="plain-action" type="button" data-term-help="${escape(term.term)}">I don't get this</button></article>`).join("");

  const index = course.sequences.findIndex(item => item.id === sequence.id);
  const previous = course.sequences[index - 1], next = course.sequences[index + 1];
  document.querySelector("#biologyPagination").innerHTML = `${previous ? `<a class="btn" href="biology-topic.html?t=${previous.id}">← ${previous.id} ${escape(previous.title)}</a>` : `<a class="btn" href="biology.html">← Biology hub</a>`}<a class="btn" href="biology.html">Course map</a>${next ? `<a class="btn" href="biology-topic.html?t=${next.id}">${next.id} ${escape(next.title)} →</a>` : `<a class="btn" href="biology-session.html">Study session →</a>`}`;

  const context = () => `Biology 1 Honors, Unit 1, sequence ${sequence.id}: ${sequence.title}. Current saved mastery: ${mastery.label}${mastery.score === null ? "" : ` (${mastery.score}%)`}. The visible StudySpace content is a general science explanation organized from the supplied course outline; no original teacher source file is available.`;
  document.querySelector("#studySequence").onclick = () => app.studyThis({ title: `${sequence.id} ${sequence.title}`, text: document.querySelector("main").innerText.slice(0, 8000), source: "StudySpace general explanation based on supplied Biology outline" });
  document.querySelector("#askSequence").onclick = () => app.openAI(`Tutor Mode. ${context()} Teach one concept, describe a useful model or diagram, give one application, then ask one question and wait.`);
  document.querySelectorAll("[data-ai-action]").forEach(button => button.onclick = () => app.openAI(`${button.dataset.aiAction}. ${context()} Use the current visible section first and clearly label any added general explanation.`));
  document.querySelectorAll("[data-explore-help]").forEach(button => button.onclick = () => app.openAI(`${context()} Help me understand the Explore activity "${button.dataset.exploreHelp}". Ask me to predict first, then guide me without giving everything away.`));
  document.querySelectorAll("[data-organelle]").forEach(button => button.onclick = () => app.openAI(`${context()} Give me one original practice scenario about ${button.dataset.organelle} and wait for my answer.`));
  document.querySelectorAll("[data-microscope-part]").forEach(button => button.onclick = () => app.openAI(`${context()} Give me one labeling clue for ${button.dataset.microscopePart}, wait for my answer, and then explain its function.`));
  document.querySelectorAll("[data-apply]").forEach(button => button.onclick = () => app.openAI(`${context()} Coach me through this application without immediately giving the final answer: ${sequence.elaborate[Number(button.dataset.apply)]}`));
  document.querySelectorAll("[data-term-help]").forEach(button => button.onclick = () => app.openAI(`${context()} Explain ${button.dataset.termHelp} more simply, give one concrete example, then ask one quick question.`));
  document.querySelector("#cerCoach").onclick = () => app.openAI(`${context()} Coach me through this CER one part at a time and wait after each step: ${sequence.cer.prompt}`);
})();
