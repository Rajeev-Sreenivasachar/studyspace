(function () {
  "use strict";
  const unit = globalThis.APHG_UNIT1;
  const app = globalThis.StudySpace;
  const escape = value => app.escapeHtml(value);

  function renderMastery() {
    const mastery = app.allMastery(unit);
    document.querySelector("#masteryMap").innerHTML = mastery.map(item => {
      const score = item.score === null ? "—" : `${item.score}%`;
      const status = item.score === null ? "unrated" : item.score >= 80 ? "strong" : item.score >= 60 ? "developing" : "weak";
      return `<article class="mastery-topic ${status}" aria-label="Topic ${item.topic} ${escape(item.title)}: ${item.label}">
        <div class="mastery-top"><span>Topic ${item.topic}</span><strong>${score}</strong></div><h3>${escape(item.title)}</h3><p><span class="status-symbol" aria-hidden="true">${status === "strong" ? "✓" : status === "developing" ? "◐" : status === "weak" ? "!" : "○"}</span> ${item.label}</p>
        <div class="mastery-actions"><a href="aphg-topic.html?t=${item.topic}">Notes</a><a href="aphg-flashcards.html?topic=${item.topic}">Cards</a><a href="aphg-quiz.html?topic=${item.topic}&mode=topic">Practice</a><button type="button" data-ai-topic="${item.topic}">Ask AI</button></div>
      </article>`;
    }).join("");
    const measured = mastery.filter(item => item.score !== null);
    document.querySelector("#overallMastery").textContent = measured.length >= 2 ? `${Math.round(measured.reduce((sum, item) => sum + item.score, 0) / measured.length)}% measured mastery` : "Not enough data yet";
    document.querySelectorAll("[data-ai-topic]").forEach(button => button.onclick = () => app.openAI(`Help me review AP Human Geography Topic ${button.dataset.aiTopic}. Use the visible StudySpace source notes first.`));
  }

  function renderTopics() {
    document.querySelector("#topicGrid").innerHTML = unit.topics.map(topic => `<article class="topic-card" data-searchable="${escape(`${topic.id} ${topic.title} ${topic.overview} ${topic.essentials.join(" ")}`.toLowerCase())}">
      <div class="topic-card-top"><span class="topic-number">${topic.id}</span><span class="source-chip ${topic.sourceStatus === "teacher" ? "teacher" : "pending"}">${topic.sourceStatus === "teacher" ? "Teacher source" : "AMSCO file needed"}</span></div>
      <h3>${escape(topic.title)}</h3><p>${escape(topic.overview)}</p><div class="topic-links"><a class="btn small primary" href="aphg-topic.html?t=${topic.id}">Review notes</a><a class="btn small" href="aphg-quiz.html?topic=${topic.id}&mode=topic">Practice</a></div>
    </article>`).join("");
  }

  function renderMaterials() {
    const groups = [...new Set(unit.materials.map(material => material.group))];
    document.querySelector("#materialsList").innerHTML = groups.map(group => `<section class="material-group"><h3>${escape(group)}</h3><div class="material-list">${unit.materials.filter(material => material.group === group).map(material => `<a class="material-row" href="aphg-material.html?id=${material.id}"><span class="material-icon" aria-hidden="true">${material.group.startsWith("Teacher") ? "▣" : material.group.startsWith("Textbook") ? "▤" : "✓"}</span><span><strong>${escape(material.title)}</strong><small>${material.status === "transcribed" ? "Verified concepts available · original file not supplied" : "Source slot ready · file not supplied"}</small></span><span class="link">Open →</span></a>`).join("")}</div></section>`).join("");
  }

  function setupSearch() {
    const input = document.querySelector("#resourceSearch");
    const matches = document.querySelector("#topicMatches");
    input.oninput = () => {
      const query = input.value.trim().toLowerCase();
      let shown = 0;
      document.querySelectorAll("[data-searchable]").forEach(card => {
        const visible = !query || card.dataset.searchable.includes(query) || card.textContent.toLowerCase().includes(query);
        card.hidden = !visible;
        if (visible) shown += 1;
      });
      matches.textContent = query ? `${shown} matching resource${shown === 1 ? "" : "s"}` : "";
    };
  }

  document.querySelector("#vocabAvailable").textContent = unit.assignedVocabularyAvailable;
  document.querySelector("#questionCount").textContent = globalThis.APHG_QUESTIONS.length;
  document.querySelector("#studyUnit").onclick = () => app.studyThis({ title: unit.title, text: unit.topics.map(topic => `${topic.id} ${topic.title}: ${topic.essentials.join(" ")}`).join("\n"), source: "StudySpace Unit 1 source index; teacher priority for Topics 1.1 and 1.6" });
  renderMastery();
  renderTopics();
  renderMaterials();
  setupSearch();
  window.addEventListener("studyspace:data", renderMastery);
})();
