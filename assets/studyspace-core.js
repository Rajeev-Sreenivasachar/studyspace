(function () {
  "use strict";
  const STORAGE_KEY = "studyspace-app-v1";
  const MAX_ATTEMPTS = 60;
  const MAX_SETS = 40;
  const MAX_MISTAKES = 160;

  function defaults() {
    return {
      version: 3,
      assessments: [],
      planTasks: [],
      quizAttempts: [],
      questionPerformance: {},
      flashcardMastery: {},
      studySets: [],
      notes: [],
      studySessions: [],
      mistakes: [],
      preferences: { reducedMotion: false },
      meta: { createdAt: new Date().toISOString(), migratedLegacy: false }
    };
  }

  function safeParse(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function normalize(candidate) {
    const base = defaults();
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return base;
    return {
      ...base,
      ...candidate,
      version: 3,
      assessments: Array.isArray(candidate.assessments) ? candidate.assessments : [],
      planTasks: Array.isArray(candidate.planTasks) ? candidate.planTasks : [],
      quizAttempts: Array.isArray(candidate.quizAttempts) ? candidate.quizAttempts.slice(-MAX_ATTEMPTS) : [],
      questionPerformance: candidate.questionPerformance && typeof candidate.questionPerformance === "object" ? candidate.questionPerformance : {},
      flashcardMastery: candidate.flashcardMastery && typeof candidate.flashcardMastery === "object" ? candidate.flashcardMastery : {},
      studySets: Array.isArray(candidate.studySets) ? candidate.studySets.slice(-MAX_SETS) : [],
      notes: Array.isArray(candidate.notes) ? candidate.notes : [],
      studySessions: Array.isArray(candidate.studySessions) ? candidate.studySessions.slice(-100) : [],
      mistakes: Array.isArray(candidate.mistakes) ? candidate.mistakes.slice(-MAX_MISTAKES) : [],
      preferences: { ...base.preferences, ...(candidate.preferences || {}) },
      meta: { ...base.meta, ...(candidate.meta || {}) }
    };
  }

  let state = normalize(safeParse(localStorage.getItem(STORAGE_KEY), null));

  function migrateV2() {
    if (state.meta.migratedV2) return;
    update(data => {
      Object.entries(data.questionPerformance).forEach(([id, item]) => {
        if (!item.subject) item.subject = id.startsWith("bio") ? "biology" : "aphg";
      });
      Object.entries(data.flashcardMastery).forEach(([id, item]) => {
        if (!item.subject) item.subject = id.startsWith("bio-") ? "biology" : "aphg";
      });
      data.quizAttempts.forEach(attempt => { if (!attempt.subject) attempt.subject = "aphg"; });
      if (!data.mistakes.length) {
        data.quizAttempts.forEach(attempt => (attempt.results || []).filter(result => !result.correct).forEach(result => data.mistakes.push({
          id: `mistake-${attempt.id}-${result.questionId}`,
          subject: attempt.subject || "aphg",
          unit: attempt.unit || "1",
          topic: result.topic,
          concept: result.concept || result.relatedTerms?.[0] || "Review concept",
          questionType: result.questionType || "practice",
          questionId: result.questionId,
          question: result.question,
          wrongAnswer: result.picked,
          correctAnswer: result.answer,
          explanation: result.explanation,
          timestamp: attempt.createdAt || new Date().toISOString()
        })));
      }
      data.mistakes = data.mistakes.slice(-MAX_MISTAKES);
      data.meta.migratedV2 = true;
      data.meta.migratedV2At = new Date().toISOString();
    });
  }

  function migrateV3() {
    if (state.meta.migratedV3) return;
    update(data => {
      Object.entries(data.questionPerformance).forEach(([id, item]) => {
        if (!item.subject && id.startsWith("alg")) item.subject = "algebra2";
      });
      Object.entries(data.flashcardMastery).forEach(([id, item]) => {
        if (!item.subject && id.startsWith("alg-")) item.subject = "algebra2";
      });
      data.mistakes.forEach(item => {
        if (!item.subject && String(item.questionId || "").startsWith("alg")) item.subject = "algebra2";
        if (!item.mistakeCategory) item.mistakeCategory = "Review the concept and operation used";
        if (typeof item.reviewed !== "boolean") item.reviewed = false;
        if (typeof item.laterCorrected !== "boolean") item.laterCorrected = false;
      });
      data.meta.migratedV3 = true;
      data.meta.migratedV3At = new Date().toISOString();
    });
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent("studyspace:data", { detail: snapshot() }));
    } catch (error) {
      console.warn("StudySpace could not save local progress.", error?.name || "StorageError");
    }
  }

  function snapshot() { return JSON.parse(JSON.stringify(state)); }

  function update(mutator) {
    mutator(state);
    state = normalize(state);
    save();
    return snapshot();
  }

  function migrateLegacy() {
    if (state.meta.migratedLegacy) return;
    const legacyFlash = safeParse(localStorage.getItem("studyspace-aphg-flashcards"), null);
    const legacyQuiz = safeParse(localStorage.getItem("studyspace-aphg-quiz-history"), null);
    update(data => {
      if (legacyFlash && typeof legacyFlash === "object") {
        Object.entries(legacyFlash).forEach(([id, status]) => {
          if (!data.flashcardMastery[id] && ["mastered", "learning"].includes(status)) {
            data.flashcardMastery[id] = { status, topic: null, seen: 1, correct: status === "mastered" ? 1 : 0, updatedAt: new Date().toISOString() };
          }
        });
      }
      if (Array.isArray(legacyQuiz)) data.quizAttempts.push(...legacyQuiz.slice(-10));
      data.meta.migratedLegacy = true;
      data.meta.migratedAt = new Date().toISOString();
    });
  }

  function recordFlashcard(term, status) {
    if (!term?.id || !["mastered", "learning"].includes(status)) return;
    update(data => {
      const current = data.flashcardMastery[term.id] || { seen: 0, correct: 0 };
      data.flashcardMastery[term.id] = {
        ...current,
        term: term.term,
        concept: term.concept || term.term,
        topic: term.topic,
        subject: term.subject || (term.id.startsWith("bio-") ? "biology" : term.id.startsWith("alg-") ? "algebra2" : "aphg"),
        status,
        seen: (current.seen || 0) + 1,
        correct: (current.correct || 0) + (status === "mastered" ? 1 : 0),
        updatedAt: new Date().toISOString()
      };
    });
  }

  function recordQuizAttempt(attempt) {
    if (!attempt || !Array.isArray(attempt.results)) return;
    update(data => {
      const normalizedAttempt = {
        id: attempt.id || `quiz-${Date.now()}`,
        subject: attempt.subject || "aphg",
        unit: attempt.unit || "1",
        mode: attempt.mode || "quick",
        topic: attempt.topic || null,
        score: Number(attempt.score) || 0,
        total: Number(attempt.total) || attempt.results.length,
        percentage: Number(attempt.percentage) || 0,
        createdAt: attempt.createdAt || new Date().toISOString(),
        results: attempt.results.slice(0, 60).map(result => ({ ...result, subject: attempt.subject || "aphg" }))
      };
      data.quizAttempts.push(normalizedAttempt);
      data.quizAttempts = data.quizAttempts.slice(-MAX_ATTEMPTS);
      normalizedAttempt.results.forEach(result => {
        if (!result.questionId) return;
        const current = data.questionPerformance[result.questionId] || { correct: 0, total: 0, recent: [] };
        const isCorrect = Boolean(result.correct);
        data.questionPerformance[result.questionId] = {
          ...current,
          topic: result.topic,
          subject: normalizedAttempt.subject,
          concept: result.concept || result.relatedTerms?.[0] || null,
          questionType: result.questionType || result.type || "practice",
          relatedTerms: Array.isArray(result.relatedTerms) ? result.relatedTerms : [],
          correct: (current.correct || 0) + (isCorrect ? 1 : 0),
          total: (current.total || 0) + 1,
          recent: [...(current.recent || []), isCorrect].slice(-8),
          lastAnsweredAt: normalizedAttempt.createdAt
        };
        if (!isCorrect) data.mistakes.push({
          id: `mistake-${normalizedAttempt.id}-${result.questionId}`,
          subject: normalizedAttempt.subject,
          unit: normalizedAttempt.unit,
          topic: result.topic,
          concept: result.concept || result.relatedTerms?.[0] || "Review concept",
          questionType: result.questionType || result.type || "practice",
          questionId: result.questionId,
          question: result.question,
          wrongAnswer: result.picked,
          correctAnswer: result.answer,
          explanation: result.explanation,
          mistakeCategory: result.mistakeCategory || "Review the concept and operation used",
          reviewed: false,
          laterCorrected: false,
          timestamp: normalizedAttempt.createdAt
        });
        else data.mistakes.forEach(item => {
          if (item.subject === normalizedAttempt.subject && !item.laterCorrected && (item.questionId === result.questionId || item.concept === result.concept)) item.laterCorrected = true;
        });
      });
      data.mistakes = data.mistakes.slice(-MAX_MISTAKES);
    });
  }

  function topicMastery(topicId, unit = globalThis.APHG_UNIT1) {
    const subject = unit?.subjectKey || (unit?.id?.startsWith("biology") ? "biology" : "aphg");
    const questionRecords = Object.values(state.questionPerformance).filter(item => item.topic === topicId && (item.subject === subject || subject === "aphg" && !item.subject));
    const quizTotal = questionRecords.reduce((sum, item) => sum + (item.total || 0), 0);
    const quizCorrect = questionRecords.reduce((sum, item) => sum + (item.correct || 0), 0);
    const recent = questionRecords.flatMap(item => item.recent || []).slice(-12);
    const topicTerms = unit?.termsForTopic ? unit.termsForTopic(topicId) : [];
    const cardRecords = topicTerms.map(term => state.flashcardMastery[term.id]).filter(Boolean);
    const cardSeen = cardRecords.length;
    const mastered = cardRecords.filter(item => item.status === "mastered").length;
    const evidence = quizTotal + cardSeen;
    if (evidence < 3) return { topic: topicId, score: null, label: subject !== "aphg" ? (evidence ? "Learning" : "Not Started") : "Not enough data yet", evidence };

    let weighted = 0;
    let weight = 0;
    if (quizTotal) {
      const overall = quizCorrect / quizTotal;
      const recentScore = recent.length ? recent.filter(Boolean).length / recent.length : overall;
      weighted += (overall * 0.6 + recentScore * 0.4) * 0.7;
      weight += 0.7;
    }
    if (cardSeen) {
      weighted += (mastered / cardSeen) * 0.3;
      weight += 0.3;
    }
    const score = Math.round((weighted / weight) * 100);
    const label = subject !== "aphg" ? (score >= 90 ? "Mastered" : score >= 80 ? "Strong" : score >= 60 ? "Developing" : "Learning") : (score >= 80 ? "Strong" : score >= 60 ? "Developing" : "Weak");
    return { topic: topicId, score, label, evidence, quizTotal, cardSeen };
  }

  function conceptMastery(subject, concept) {
    const needle = String(concept || "").toLowerCase();
    const records = Object.values(state.questionPerformance).filter(item => item.subject === subject && [item.concept, ...(item.relatedTerms || [])].some(value => String(value || "").toLowerCase() === needle));
    const quizTotal = records.reduce((sum, item) => sum + (item.total || 0), 0);
    const quizCorrect = records.reduce((sum, item) => sum + (item.correct || 0), 0);
    const cards = Object.values(state.flashcardMastery).filter(item => item.subject === subject && [item.concept, item.term].some(value => String(value || "").toLowerCase().includes(needle)));
    const evidence = quizTotal + cards.length;
    if (!evidence) return { concept, score: null, label: "Not Started", evidence: 0 };
    if (evidence < 3) return { concept, score: null, label: "Learning", evidence };
    const quizScore = quizTotal ? quizCorrect / quizTotal : null;
    const cardScore = cards.length ? cards.filter(item => item.status === "mastered").length / cards.length : null;
    const score = Math.round(100 * (quizScore === null ? cardScore : cardScore === null ? quizScore : quizScore * 0.7 + cardScore * 0.3));
    return { concept, score, label: score >= 90 ? "Mastered" : score >= 80 ? "Strong" : score >= 60 ? "Developing" : "Learning", evidence };
  }

  function mistakesFor(subject) { return state.mistakes.filter(item => !subject || item.subject === subject).slice().reverse(); }

  function markMistakeReviewed(id, reviewed = true) {
    update(data => { const item = data.mistakes.find(entry => entry.id === id); if (item) item.reviewed = Boolean(reviewed); });
  }

  function markMistakeCorrected(id, corrected = true) {
    update(data => { const item = data.mistakes.find(entry => entry.id === id); if (item) item.laterCorrected = Boolean(corrected); });
  }

  function allMastery(unit = globalThis.APHG_UNIT1) {
    return (unit?.topics || []).map(topic => ({ ...topicMastery(topic.id, unit), title: topic.title }));
  }

  function weakTopics(unit = globalThis.APHG_UNIT1) {
    return allMastery(unit).filter(item => item.score !== null && item.score < 70).sort((a, b) => a.score - b.score);
  }

  function addAssessment(input) {
    const item = {
      id: input.id || `assessment-${Date.now()}`,
      name: String(input.name || "Assessment").slice(0, 100),
      subject: String(input.subject || "General").slice(0, 80),
      date: String(input.date || ""),
      type: String(input.type || "quiz"),
      topics: String(input.topics || "").slice(0, 160),
      notes: String(input.notes || "").slice(0, 500),
      createdAt: input.createdAt || new Date().toISOString()
    };
    update(data => {
      const index = data.assessments.findIndex(existing => existing.id === item.id);
      if (index >= 0) data.assessments[index] = item;
      else data.assessments.push(item);
      data.assessments.sort((a, b) => String(a.date).localeCompare(String(b.date)));
    });
    return item;
  }

  function deleteAssessment(id) { update(data => { data.assessments = data.assessments.filter(item => item.id !== id); }); }

  function daysUntil(dateString) {
    if (!dateString) return null;
    const target = new Date(`${dateString}T12:00:00`);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    if (Number.isNaN(target.getTime())) return null;
    return Math.ceil((target - today) / 86400000);
  }

  function countdown(dateString) {
    const days = daysUntil(dateString);
    if (days === null) return "No date";
    if (days < 0) return "Past";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days left`;
  }

  function generatePlan(assessment, unit = globalThis.APHG_UNIT1) {
    const days = Math.max(0, daysUntil(assessment.date) ?? 0);
    const weak = weakTopics(unit).map(item => item.topic);
    const requested = String(assessment.topics || "").match(/1\.[1-7]/g) || unit?.topics?.map(topic => topic.id) || [];
    const priority = [...new Set([...weak.filter(topic => requested.includes(topic)), ...requested])];
    const sessions = Math.min(Math.max(days + 1, 1), 4);
    const labels = days === 0 ? ["Today"] : days === 1 ? ["Today", "Tomorrow"] : ["Today", "Next session", "Day before", "Night before"];
    const tasks = [];
    for (let index = 0; index < sessions; index += 1) {
      const topic = priority[index % Math.max(priority.length, 1)] || "Unit 1";
      const isLast = index === sessions - 1;
      tasks.push({
        id: `plan-${assessment.id}-${index}`,
        assessmentId: assessment.id,
        day: labels[Math.min(index, labels.length - 1)],
        minutes: isLast ? 20 : 15,
        title: isLast ? "Final mixed review" : `Review Topic ${topic}`,
        actions: isLast ? ["Study still-learning cards", "Take a 20-question practice quiz", "Review explanations"] : [`Review Topic ${topic}`, "Study 10–15 flashcards", "Take a quick targeted quiz"],
        complete: state.planTasks.find(task => task.id === `plan-${assessment.id}-${index}`)?.complete || false
      });
    }
    return tasks;
  }

  function setTaskComplete(task, complete) {
    update(data => {
      const index = data.planTasks.findIndex(item => item.id === task.id);
      const saved = { ...task, complete: Boolean(complete), completedAt: complete ? new Date().toISOString() : null };
      if (index >= 0) data.planTasks[index] = saved;
      else data.planTasks.push(saved);
    });
  }

  function saveStudySet(input) {
    const item = {
      id: input.id || `set-${Date.now()}`,
      subject: String(input.subject || "General").slice(0, 80),
      unit: String(input.unit || "Unsorted").slice(0, 100),
      title: String(input.title || "Imported material").slice(0, 120),
      sourceType: String(input.sourceType || "pasted-text"),
      sourceLabel: String(input.sourceLabel || "Student material").slice(0, 120),
      originalText: String(input.originalText || "").slice(0, 12000),
      generated: input.generated && typeof input.generated === "object" ? input.generated : {},
      createdAt: input.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    update(data => {
      const index = data.studySets.findIndex(existing => existing.id === item.id);
      if (index >= 0) data.studySets[index] = item;
      else data.studySets.push(item);
      data.studySets = data.studySets.slice(-MAX_SETS);
    });
    return item;
  }

  function openAI(prompt, autoSend = true) {
    window.dispatchEvent(new CustomEvent("studyspace:ai", { detail: { prompt: String(prompt || "").slice(0, 3500), autoSend } }));
  }

  function studyThis(context) {
    document.querySelector("#studyThisModal")?.remove();
    const safeContext = String(context?.text || "").trim().slice(0, 2600);
    const title = String(context?.title || "Selected material").slice(0, 120);
    const source = String(context?.source || "Student-selected StudySpace content").slice(0, 120);
    const modal = document.createElement("div");
    modal.id = "studyThisModal";
    modal.className = "study-modal-backdrop";
    modal.innerHTML = `<section class="study-modal" role="dialog" aria-modal="true" aria-labelledby="studyModalTitle">
      <div class="study-modal-head"><div><div class="eyebrow">Study This</div><h2 id="studyModalTitle">${escapeHtml(title)}</h2></div><button type="button" data-study-close aria-label="Close Study This">×</button></div>
      <p class="source-line"><strong>Source material:</strong> ${escapeHtml(source)}</p>
      <p class="muted">Choose one connected action. StudySpace AI will treat the selected material as the source and label any extra explanation.</p>
      <div class="study-action-grid">
        ${["Important concepts", "Vocabulary", "Simple notes", "Flashcards", "Mini lesson", "Practice questions", "Quiz", "Study plan"].map(action => `<button class="btn" type="button" data-study-action="${action}">${action}</button>`).join("")}
      </div>
    </section>`;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector("[data-study-close]").onclick = close;
    modal.addEventListener("click", event => { if (event.target === modal) close(); });
    modal.querySelectorAll("[data-study-action]").forEach(button => {
      button.onclick = () => {
        const action = button.dataset.studyAction;
        close();
        openAI(`STUDY THIS — ${action}\nSource label: ${source}\nTreat the following as SOURCE MATERIAL. Do not claim extra knowledge came from it. Clearly label any additional explanation.\n\n${safeContext}`);
      };
    });
    modal.querySelector("[data-study-close]").focus();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  }

  function setupSelectionActions() {
    if (document.querySelector("#selectionActions")) return;
    const toolbar = document.createElement("div");
    toolbar.id = "selectionActions";
    toolbar.className = "selection-actions";
    toolbar.hidden = true;
    toolbar.innerHTML = `<button type="button" data-select-action="Explain">Explain</button><button type="button" data-select-action="Simplify">Simplify</button><button type="button" data-select-action="Give an example">Example</button><button type="button" data-select-action="Quiz me">Quiz me</button><button type="button" data-select-action="Make a flashcard">Flashcard</button><button type="button" data-select-action="Study This">Study This</button>`;
    document.body.appendChild(toolbar);
    let selectedText = "";
    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();
      selectedText = String(selection || "").trim().slice(0, 1800);
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const inMain = range && document.querySelector("main")?.contains(range.commonAncestorContainer);
      if (selectedText.length < 3 || !inMain) return void (toolbar.hidden = true);
      const rect = range.getBoundingClientRect();
      toolbar.hidden = false;
      toolbar.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - toolbar.offsetWidth - 8))}px`;
      toolbar.style.top = `${Math.max(8, rect.top - toolbar.offsetHeight - 10)}px`;
    });
    toolbar.addEventListener("mousedown", event => event.preventDefault());
    toolbar.querySelectorAll("button").forEach(button => {
      button.onclick = () => {
        const action = button.dataset.selectAction;
        toolbar.hidden = true;
        if (action === "Study This") studyThis({ title: "Highlighted text", text: selectedText, source: document.title });
        else openAI(`${action} this selected source text. Keep source facts separate from any additional explanation:\n\n${selectedText}`);
      };
    });
    document.addEventListener("pointerdown", event => { if (!event.target.closest("#selectionActions")) toolbar.hidden = true; });
  }

  function setupPageStudyActions() {
    document.querySelectorAll(".note-section").forEach(section => {
      if (section.querySelector("[data-section-help]")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "plain-action context-help";
      button.dataset.sectionHelp = "true";
      button.textContent = "I don't get this";
      button.onclick = () => openAI(`I DON'T GET THIS\nSource page: ${document.title}\nSelected section:\n${section.innerText.slice(0, 2200)}\nExplain it more simply, give one example, then ask one quick question.`);
      section.querySelector("h2")?.insertAdjacentElement("afterend", button);
    });
    const header = document.querySelector(".page-head");
    if (header && /csit/i.test(location.pathname) && !header.querySelector("[data-page-study]")) {
      const actions = document.createElement("div");
      actions.className = "actions";
      actions.dataset.pageStudy = "true";
      actions.innerHTML = `<button class="btn primary" type="button" data-study-page>Study This</button><button class="btn" type="button" data-ask-page>Ask StudySpace AI</button>`;
      header.appendChild(actions);
      actions.querySelector("[data-study-page]").onclick = () => studyThis({ title: document.title, text: document.querySelector("main")?.innerText || "", source: "Visible StudySpace CSIT notes" });
      actions.querySelector("[data-ask-page]").onclick = () => openAI("Tutor Mode: Help me study this CSIT page. Use the visible notes first, ask one question, and wait for my answer.");
    }
  }

  migrateV2();
  migrateV3();
  migrateLegacy();
  globalThis.StudySpace = {
    storageKey: STORAGE_KEY,
    get state() { return snapshot(); },
    save,
    update,
    recordFlashcard,
    recordQuizAttempt,
    topicMastery,
    allMastery,
    weakTopics,
    conceptMastery,
    mistakesFor,
    markMistakeReviewed,
    markMistakeCorrected,
    addAssessment,
    deleteAssessment,
    daysUntil,
    countdown,
    generatePlan,
    setTaskComplete,
    saveStudySet,
    openAI,
    studyThis,
    escapeHtml
  };

  const initialize = () => { setupSelectionActions(); setupPageStudyActions(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
