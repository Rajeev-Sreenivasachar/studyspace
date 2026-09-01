(function () {
  "use strict";
  const STORAGE_KEY = "studyspace-app-v1";
  const MAX_ATTEMPTS = 60;
  const MAX_SETS = 40;
  const MAX_MISTAKES = 160;

  function defaults() {
    return {
      version: 4,
      assessments: [],
      planTasks: [],
      quizAttempts: [],
      questionPerformance: {},
      flashcardMastery: {},
      studySets: [],
      notes: [],
      studySessions: [],
      mistakes: [],
      reviewSchedule: {},
      diagnostics: [],
      bookmarks: [],
      studyQueue: [],
      recentStudy: [],
      confidence: {},
      preferences: { reducedMotion: false, focusMinutes: 25 },
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
      version: 4,
      assessments: Array.isArray(candidate.assessments) ? candidate.assessments : [],
      planTasks: Array.isArray(candidate.planTasks) ? candidate.planTasks : [],
      quizAttempts: Array.isArray(candidate.quizAttempts) ? candidate.quizAttempts.slice(-MAX_ATTEMPTS) : [],
      questionPerformance: candidate.questionPerformance && typeof candidate.questionPerformance === "object" ? candidate.questionPerformance : {},
      flashcardMastery: candidate.flashcardMastery && typeof candidate.flashcardMastery === "object" ? candidate.flashcardMastery : {},
      studySets: Array.isArray(candidate.studySets) ? candidate.studySets.slice(-MAX_SETS) : [],
      notes: Array.isArray(candidate.notes) ? candidate.notes : [],
      studySessions: Array.isArray(candidate.studySessions) ? candidate.studySessions.slice(-100) : [],
      mistakes: Array.isArray(candidate.mistakes) ? candidate.mistakes.slice(-MAX_MISTAKES) : [],
      reviewSchedule: candidate.reviewSchedule && typeof candidate.reviewSchedule === "object" && !Array.isArray(candidate.reviewSchedule) ? candidate.reviewSchedule : {},
      diagnostics: Array.isArray(candidate.diagnostics) ? candidate.diagnostics.slice(-60) : [],
      bookmarks: Array.isArray(candidate.bookmarks) ? candidate.bookmarks.slice(-200) : [],
      studyQueue: Array.isArray(candidate.studyQueue) ? candidate.studyQueue.slice(-100) : [],
      recentStudy: Array.isArray(candidate.recentStudy) ? candidate.recentStudy.slice(-100) : [],
      confidence: candidate.confidence && typeof candidate.confidence === "object" && !Array.isArray(candidate.confidence) ? candidate.confidence : {},
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

  function migrateV4() {
    if (state.meta.migratedV4) return;
    update(data => {
      data.reviewSchedule ||= {};
      data.diagnostics ||= [];
      data.bookmarks ||= [];
      data.studyQueue ||= [];
      data.recentStudy ||= [];
      data.confidence ||= {};
      Object.entries(data.flashcardMastery).forEach(([id, item]) => {
        if (!data.reviewSchedule[`card:${id}`] && item.updatedAt) {
          const intervalDays = item.status === "mastered" ? 4 : 1;
          data.reviewSchedule[`card:${id}`] = {
            id: `card:${id}`, kind: "flashcard", subject: item.subject || "aphg", topic: item.topic || null,
            itemId: id, intervalDays, ease: item.status === "mastered" ? 2.3 : 1.8,
            lastReviewedAt: item.updatedAt, dueAt: new Date(new Date(item.updatedAt).getTime() + intervalDays * 86400000).toISOString()
          };
        }
      });
      data.meta.migratedV4 = true;
      data.meta.migratedV4At = new Date().toISOString();
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

  function nextInterval(previous, quality) {
    if (quality <= 1) return { intervalDays: 1, ease: Math.max(1.3, (previous?.ease || 2.2) - .2) };
    const ease = Math.min(3, (previous?.ease || 2.2) + (quality >= 4 ? .08 : 0));
    const prior = Math.max(1, previous?.intervalDays || 1);
    return { intervalDays: Math.max(2, Math.round(prior * ease)), ease };
  }

  function setReview(data, { id, kind, subject, unit = null, topic = null, itemId, quality = 2 }) {
    const previous = data.reviewSchedule[id];
    const timing = nextInterval(previous, quality);
    const now = new Date();
    data.reviewSchedule[id] = {
      id, kind, subject, unit, topic, itemId, ...timing,
      lastReviewedAt: now.toISOString(), dueAt: new Date(now.getTime() + timing.intervalDays * 86400000).toISOString()
    };
  }

  function addRecent(data, item) {
    const normalized = { id: item.id || `${item.type || "study"}:${item.subject || "general"}:${item.topic || Date.now()}`, ...item, studiedAt: item.studiedAt || new Date().toISOString() };
    data.recentStudy = [normalized, ...data.recentStudy.filter(existing => existing.id !== normalized.id)].slice(0, 100);
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
      setReview(data, { id: `card:${term.id}`, kind: "flashcard", subject: term.subject || data.flashcardMastery[term.id].subject, unit: term.unit || null, topic: term.topic || null, itemId: term.id, quality: status === "mastered" ? 4 : 1 });
      addRecent(data, { id: `flashcards:${data.flashcardMastery[term.id].subject}:${term.topic || "general"}`, type: "flashcards", subject: data.flashcardMastery[term.id].subject, unit: term.unit || null, topic: term.topic || null, title: term.term || "Flashcards" });
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
        setReview(data, { id: `concept:${normalizedAttempt.subject}:${normalizedAttempt.unit}:${result.topic || result.concept || result.questionId}`, kind: "concept", subject: normalizedAttempt.subject, unit: normalizedAttempt.unit, topic: result.topic || null, itemId: result.concept || result.questionId, quality: isCorrect ? 4 : 1 });
      });
      data.mistakes = data.mistakes.slice(-MAX_MISTAKES);
      addRecent(data, { id: `quiz:${normalizedAttempt.subject}:${normalizedAttempt.unit}:${normalizedAttempt.topic || "mixed"}`, type: "quiz", subject: normalizedAttempt.subject, unit: normalizedAttempt.unit, topic: normalizedAttempt.topic, title: `${normalizedAttempt.mode} quiz`, score: normalizedAttempt.percentage });
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
    const timestamps = [...questionRecords.map(item => item.lastAnsweredAt), ...cardRecords.map(item => item.updatedAt)].filter(Boolean).map(value => new Date(value).getTime()).filter(Number.isFinite);
    const newest = timestamps.length ? Math.max(...timestamps) : Date.now();
    const ageDays = Math.max(0, (Date.now() - newest) / 86400000);
    const decay = ageDays <= 14 ? 1 : Math.max(.78, 1 - (ageDays - 14) * .004);
    const score = Math.round((weighted / weight) * 100 * decay);
    const label = subject !== "aphg" ? (score >= 90 ? "Mastered" : score >= 80 ? "Strong" : score >= 60 ? "Developing" : "Learning") : (score >= 80 ? "Strong" : score >= 60 ? "Developing" : "Weak");
    return { topic: topicId, score, label, evidence, quizTotal, cardSeen, ageDays: Math.round(ageDays), needsRefresh: ageDays >= 21 };
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

  function dueReviews(subject = null, limit = 20) {
    const now = Date.now();
    return Object.values(state.reviewSchedule).filter(item => (!subject || item.subject === subject) && new Date(item.dueAt).getTime() <= now).sort((a, b) => String(a.dueAt).localeCompare(String(b.dueAt))).slice(0, limit);
  }

  function findLearningCourse(courseId) { return globalThis.STUDYSPACE_LEARNING?.course(courseId) || null; }

  function lessonHref(course, unit, lesson) {
    const q = encodeURIComponent;
    if (course.id === "aphg" && unit.id === "1") return `aphg-topic.html?t=${q(lesson.topic)}`;
    if (course.id === "algebra2" && unit.id === "class-1") return `algebra2-section.html?s=${q(lesson.topic)}`;
    if (course.id === "biology" && unit.id === "1") return `biology-topic.html?t=${q(lesson.topic)}`;
    if (course.id === "csit-essentials" && unit.id === "1") return "csit-module1.html";
    return `course-lesson.html?c=${q(course.id)}&u=${q(unit.id)}&l=${q(lesson.topic)}`;
  }

  function nextBestStep(courseId) {
    const course = findLearningCourse(courseId);
    if (!course) return null;
    const all = course.units.flatMap(unit => unit.lessons.map(lesson => {
      const masteryUnit = { id: `${course.id}-${unit.id}`, subjectKey: course.id, topics: unit.lessons.map(item => ({ id: item.topic, title: item.title })), termsForTopic: topicId => {
        const target = unit.lessons.find(item => item.topic === topicId);
        return (target?.vocabulary || []).map(card => ({ id: `${course.id}-${target.topic}-${String(card.term).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}` }));
      } };
      return { course, unit, lesson, mastery: topicMastery(lesson.topic, masteryUnit) };
    }));
    const due = dueReviews(courseId, 1)[0];
    if (due) {
      const match = all.find(item => item.unit.id === due.unit && item.lesson.topic === due.topic) || all.find(item => item.lesson.topic === due.topic);
      if (match) return { type: "review", reason: "Due for spaced review", title: match.lesson.title, href: lessonHref(course, match.unit, match.lesson), ...match };
    }
    const weak = all.filter(item => item.mastery.score !== null && item.mastery.score < 70).sort((a, b) => a.mastery.score - b.mastery.score)[0];
    if (weak) {
      const prerequisite = (weak.lesson.dependsOn || []).map(id => all.find(item => item.lesson.topic === id)).find(item => item && (item.mastery.score === null || item.mastery.score < 70));
      const target = prerequisite || weak;
      return { type: prerequisite ? "prerequisite" : "weak-area", reason: prerequisite ? `Build the prerequisite for ${weak.lesson.title}` : `Strengthen a ${weak.mastery.score}% area`, title: target.lesson.title, href: lessonHref(course, target.unit, target.lesson), ...target };
    }
    const started = all.filter(item => item.mastery.evidence > 0).sort((a, b) => (a.mastery.ageDays || 0) - (b.mastery.ageDays || 0));
    const firstNew = all.find(item => !item.mastery.evidence);
    const target = firstNew || started[0] || all[0];
    return target ? { type: firstNew ? "continue" : "refresh", reason: firstNew ? "Continue the course sequence" : "Refresh a completed concept", title: target.lesson.title, href: lessonHref(course, target.unit, target.lesson), ...target } : null;
  }

  function quickStudy(courseId, minutes = 10) {
    const next = nextBestStep(courseId);
    if (!next) return null;
    return { ...next, minutes: Math.max(5, Math.min(20, Number(minutes) || 10)), actions: ["Recall the idea before opening notes", "Answer two or three targeted questions", "Explain one correction in your own words"] };
  }

  function weeklyReview() {
    const since = Date.now() - 7 * 86400000;
    const sessions = state.studySessions.filter(item => new Date(item.completedAt || item.studiedAt).getTime() >= since);
    const attempts = state.quizAttempts.filter(item => new Date(item.createdAt).getTime() >= since);
    const corrected = state.mistakes.filter(item => item.laterCorrected && new Date(item.timestamp).getTime() >= since).length;
    const totalQuestions = attempts.reduce((sum, item) => sum + (item.total || 0), 0), correct = attempts.reduce((sum, item) => sum + (item.score || 0), 0);
    return { sessions: sessions.length, minutes: sessions.reduce((sum, item) => sum + (Number(item.minutes) || 0), 0), questions: totalQuestions, accuracy: totalQuestions ? Math.round(correct / totalQuestions * 100) : null, corrected, due: dueReviews().length };
  }

  function recordDiagnostic(input) {
    if (!input?.subject || !Array.isArray(input.results)) return null;
    const item = { id: input.id || `diagnostic-${Date.now()}`, subject: String(input.subject), unit: String(input.unit || ""), score: Number(input.score) || 0, total: Number(input.total) || input.results.length, results: input.results.slice(0, 30), createdAt: new Date().toISOString() };
    update(data => {
      data.diagnostics.push(item);
      data.diagnostics = data.diagnostics.slice(-60);
      item.results.forEach(result => setReview(data, { id: `concept:${item.subject}:${item.unit}:${result.topic || result.questionId}`, kind: "concept", subject: item.subject, unit: item.unit, topic: result.topic || null, itemId: result.title || result.questionId, quality: result.correct ? 3 : 1 }));
      addRecent(data, { id: `diagnostic:${item.subject}:${item.unit}`, type: "diagnostic", subject: item.subject, unit: item.unit, title: "Unit diagnostic", score: item.total ? Math.round(item.score / item.total * 100) : 0 });
    });
    return item;
  }

  function setConfidence(key, value) {
    const level = Math.max(1, Math.min(5, Number(value) || 1));
    update(data => { data.confidence[String(key)] = { value: level, updatedAt: new Date().toISOString() }; });
  }

  function toggleBookmark(item) {
    if (!item?.id) return false;
    let added = false;
    update(data => { const index = data.bookmarks.findIndex(entry => entry.id === item.id); if (index >= 0) data.bookmarks.splice(index, 1); else { data.bookmarks.unshift({ ...item, savedAt: new Date().toISOString() }); added = true; } });
    return added;
  }

  function toggleQueue(item) {
    if (!item?.id) return false;
    let added = false;
    update(data => { const index = data.studyQueue.findIndex(entry => entry.id === item.id); if (index >= 0) data.studyQueue.splice(index, 1); else { data.studyQueue.unshift({ ...item, queuedAt: new Date().toISOString() }); added = true; } });
    return added;
  }

  function exportBackup() {
    return JSON.stringify({ schema: "studyspace-backup", version: 1, exportedAt: new Date().toISOString(), appState: snapshot(), courseSetup: safeParse(localStorage.getItem("studyspace-course-setup-v2"), null), chats: Object.fromEntries(Object.keys(localStorage).filter(key => key.startsWith("studyspace-chat")).map(key => [key, safeParse(localStorage.getItem(key), null)])) }, null, 2);
  }

  function importBackup(value) {
    const parsed = typeof value === "string" ? safeParse(value, null) : value;
    if (!parsed || parsed.schema !== "studyspace-backup" || parsed.version !== 1 || !parsed.appState || typeof parsed.appState !== "object") throw new Error("This is not a valid StudySpace backup file.");
    state = normalize(parsed.appState);
    state.meta.importedAt = new Date().toISOString();
    save();
    if (parsed.courseSetup && typeof parsed.courseSetup === "object") localStorage.setItem("studyspace-course-setup-v2", JSON.stringify(parsed.courseSetup));
    if (parsed.chats && typeof parsed.chats === "object") Object.entries(parsed.chats).forEach(([key, item]) => { if (key.startsWith("studyspace-chat") && item != null) localStorage.setItem(key, JSON.stringify(item)); });
    return snapshot();
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
    const allCourses = Object.values(globalThis.STUDYSPACE_COURSES?.courses || {});
    const course = allCourses.find(item => item.id === assessment.subject || item.title === assessment.subject) || null;
    const learningCourse = course ? findLearningCourse(course.id) : null;
    const requestedIds = String(assessment.topics || "").match(/[A-Za-z]*\d+(?:\.\d+)?/g) || [];
    const candidates = learningCourse ? learningCourse.units.flatMap(courseUnit => courseUnit.lessons.map(lesson => ({ courseUnit, lesson }))) : [];
    const scoped = requestedIds.length ? candidates.filter(item => requestedIds.some(id => item.lesson.topic === id || item.courseUnit.id === id)) : candidates;
    const measured = scoped.map(item => ({ ...item, mastery: conceptMastery(course?.id, item.lesson.title) })).sort((a, b) => (a.mastery.score ?? 101) - (b.mastery.score ?? 101));
    const priority = measured.length ? measured : (unit?.topics || []).map(topicItem => ({ lesson: { topic: topicItem.id, title: topicItem.title }, mastery: topicMastery(topicItem.id, unit) }));
    const sessions = Math.min(Math.max(days + 1, 1), 7);
    const labels = days === 0 ? ["Today"] : days === 1 ? ["Today", "Tomorrow"] : ["Today", "Next session", "Midway check", "Two days before", "Day before", "Night before", "Test day warm-up"];
    const tasks = [];
    for (let index = 0; index < sessions; index += 1) {
      const target = priority[index % Math.max(priority.length, 1)] || { lesson: { topic: "", title: assessment.topics || "Assessment topics" } };
      const isLast = index === sessions - 1;
      const minutes = days <= 1 ? (isLast ? 20 : 25) : index < 2 ? 15 : 20;
      tasks.push({
        id: `plan-${assessment.id}-${index}`,
        assessmentId: assessment.id,
        day: labels[Math.min(index, labels.length - 1)],
        minutes,
        subject: course?.id || assessment.subject,
        unit: target.courseUnit?.id || null,
        topic: target.lesson?.topic || null,
        title: isLast ? "Final mixed retrieval" : `${target.mastery?.score !== null && target.mastery?.score !== undefined && target.mastery.score < 70 ? "Strengthen" : "Study"} ${target.lesson?.title || assessment.topics || "assessment topics"}`,
        actions: isLast ? ["Answer a short mixed set without notes", "Check every miss and explain the correction", "Stop with time to sleep and reset"] : [`Recall the core idea before rereading`, "Practice 3–5 targeted questions", "Record one mistake or remaining question"],
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

  function setupFeedbackAction() {
    if (location.pathname.endsWith("feedback.html") || document.querySelector("[data-page-feedback]")) return;
    const main = document.querySelector("main");
    if (!main) return;
    const link = document.createElement("a");
    const context = new URLSearchParams({ from: location.pathname, path: `${location.pathname}${location.search}`, title: document.title, course: document.body.dataset.subject || "", topic: document.body.dataset.topic || "" });
    link.href = `feedback.html?${context}`;
    link.className = "page-feedback-link";
    link.dataset.pageFeedback = "true";
    link.textContent = "Report an issue on this page";
    main.appendChild(link);
  }

  migrateV2();
  migrateV3();
  migrateV4();
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
    dueReviews,
    nextBestStep,
    quickStudy,
    weeklyReview,
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
    recordDiagnostic,
    setConfidence,
    toggleBookmark,
    toggleQueue,
    exportBackup,
    importBackup,
    saveStudySet,
    openAI,
    studyThis,
    escapeHtml
  };

  const initialize = () => { setupSelectionActions(); setupPageStudyActions(); setupFeedbackAction(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
