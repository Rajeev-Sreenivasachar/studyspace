(function () {
  "use strict";
  const unit = globalThis.APHG_UNIT1;
  const app = globalThis.StudySpace;
  const id = new URLSearchParams(location.search).get("t") || "1.1";
  const topic = unit.topic(id) || unit.topics[0];
  const escape = value => app.escapeHtml(value);
  const sourceMaterialFor = source => topic.sourceIds.map(sourceId => unit.material(sourceId)).find(material => material?.source === source);
  const sourceLink = source => {
    const material = sourceMaterialFor(source);
    const label = unit.sourceLabel(source);
    return material ? `<a class="source-label ${source}" href="aphg-material.html?id=${material.id}">Source: ${escape(label)} →</a>` : `<span class="source-label ${source}">${source === "studyspace-ai" ? "Additional StudySpace explanation" : `Source: ${escape(label)}`}</span>`;
  };

  document.title = `Topic ${topic.id}: ${topic.title} | StudySpace`;
  document.querySelector("#topicEyebrow").textContent = `AP Human Geography • Topic ${topic.id}`;
  document.querySelector("#topicTitle").innerHTML = `${topic.id} <span class="gradient-text">${escape(topic.title)}</span>`;
  document.querySelector("#topicOverview").textContent = topic.overview;
  document.querySelector("#topicCards").href = `aphg-flashcards.html?topic=${topic.id}`;
  document.querySelector("#topicQuiz").href = `aphg-quiz.html?topic=${topic.id}&mode=topic`;
  document.querySelector("#topicSources").innerHTML = topic.sourceIds.map(sourceId => {
    const material = unit.material(sourceId);
    return material ? `<a href="aphg-material.html?id=${material.id}" class="source-pill ${material.source}">${escape(material.title)} · ${material.status === "file-needed" ? "file needed" : "concepts available"}</a>` : "";
  }).join("");
  document.querySelector("#essentialGrid").innerHTML = topic.essentials.map((concept, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><p>${escape(concept)}</p></article>`).join("");
  document.querySelector("#topicNotes").innerHTML = topic.notes.map((note, index) => `<article class="topic-note" data-source="${note.source}"><div class="topic-note-head"><div><h3>${escape(note.heading)}</h3>${sourceLink(note.source)}</div><button class="plain-action" type="button" data-confused="${index}">I don't get this</button></div><p>${escape(note.body)}</p></article>`).join("");
  document.querySelector("#rememberList").innerHTML = topic.remember.map(item => `<li>${escape(item)}</li>`).join("");
  document.querySelector("#confusionList").innerHTML = topic.confusions.map(item => `<li>${escape(item)}</li>`).join("");
  const terms = topic.vocabularyIds.map(termId => unit.vocabulary.find(term => term.id === termId)).filter(Boolean);
  document.querySelector("#topicVocabulary").innerHTML = terms.length ? terms.map(term => `<article class="term"><div class="term-num">ASSIGNMENT ${term.number} · TOPIC ${term.topic}</div><h3>${escape(term.term)}</h3><p>${escape(term.definition)}</p><p class="simple-explanation"><strong>In simple words:</strong> ${escape(term.simpleExplanation)}</p><p class="example"><strong>Example:</strong> ${escape(term.example)}</p></article>`).join("") : `<div class="source-notice"><strong>No numbered term is currently assigned to this topic in the available 1–17 source.</strong><p>The topic still appears in practice and notes. Add the complete vocabulary sheet to preserve the remaining assignment numbers.</p></div>`;
  const questions = globalThis.APHG_QUESTIONS.filter(question => question.topic === topic.id).slice(0, 4);
  document.querySelector("#practiceList").innerHTML = questions.map((question, index) => `<details class="practice-question"><summary><span>${index + 1}</span>${escape(question.question)}</summary><p><strong>Answer:</strong> ${escape(question.answer)}</p><p>${escape(question.explanation)}</p></details>`).join("");

  const topicText = `${topic.id} ${topic.title}\n${topic.essentials.join("\n")}\n${topic.notes.map(note => `${note.heading}: ${note.body} [${unit.sourceLabel(note.source)}]`).join("\n")}`;
  document.querySelector("#studyTopic").onclick = () => app.studyThis({ title: `Topic ${topic.id}: ${topic.title}`, text: topicText, source: topic.sourceStatus === "teacher" ? "Teacher material prioritized" : "Existing StudySpace notes; AMSCO file not supplied" });
  document.querySelector("#askTopic").onclick = () => app.openAI(`Teach me AP Human Geography Topic ${topic.id}: ${topic.title}. Use the visible source-aware page first, ask one check-for-understanding question, and wait for my answer.`);
  document.querySelectorAll("[data-confused]").forEach(button => button.onclick = () => {
    const note = topic.notes[Number(button.dataset.confused)];
    app.openAI(`I DON'T GET THIS\nConcept: ${note.heading}\nSource: ${unit.sourceLabel(note.source)}\nSource text: ${note.body}\nExplain it more simply, give one clear example, then ask one quick check-for-understanding question.`);
  });
  const position = unit.topics.findIndex(item => item.id === topic.id);
  const previous = unit.topics[position - 1] || unit.topics[unit.topics.length - 1];
  const next = unit.topics[position + 1] || unit.topics[0];
  document.querySelector("#previousTopic").href = `aphg-topic.html?t=${previous.id}`;
  document.querySelector("#previousTopic").textContent = `← ${previous.id} ${previous.title}`;
  document.querySelector("#nextTopic").href = `aphg-topic.html?t=${next.id}`;
  document.querySelector("#nextTopic").textContent = `${next.id} ${next.title} →`;
})();
