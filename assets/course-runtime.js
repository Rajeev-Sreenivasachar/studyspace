(function () {
  "use strict";
  const root = document.querySelector("#courseRuntime");
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const courseId = params.get("c") || params.get("s");
  const unitId = params.get("u");
  const lessonId = params.get("l");
  const page = document.body.dataset.coursePage || "course";
  const learning = globalThis.STUDYSPACE_LEARNING;
  const app = globalThis.StudySpace;
  const course = learning?.course(courseId);
  const esc = value => app?.escapeHtml ? app.escapeHtml(value) : String(value ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const q = value => encodeURIComponent(value);
  const unitHref = unit => course.id === "aphg" && unit.id === "1" ? "aphg.html" : course.id === "algebra2" && unit.id === "class-1" ? "algebra2.html" : course.id === "biology" && unit.id === "1" ? "biology.html" : course.id === "csit-essentials" && unit.id === "1" ? "csit-module1.html" : `course-unit.html?c=${q(course.id)}&u=${q(unit.id)}`;
  const lessonHref = (unit, lesson) => course.id === "aphg" && unit.id === "1" ? `aphg-topic.html?t=${q(lesson.topic)}` : course.id === "algebra2" && unit.id === "class-1" ? `algebra2-section.html?s=${q(lesson.topic)}` : course.id === "biology" && unit.id === "1" ? `biology-topic.html?t=${q(lesson.topic)}` : course.id === "csit-essentials" && unit.id === "1" ? "csit-module1.html" : `course-lesson.html?c=${q(course.id)}&u=${q(unit.id)}&l=${q(lesson.topic)}`;
  const toolHref = (name, unit = null) => `course-${name}.html?c=${q(course.id)}${unit ? `&u=${q(unit.id)}` : ""}`;
  const badge = source => `<span class="source-chip ${esc(source.type)}">${source.type === "official-framework" ? "Official framework" : source.type === "teacher-class-material" ? "Class material" : "StudySpace original"}</span>`;
  const flashId = (lesson, term) => `${course.id}-${lesson.topic}-${String(term).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

  if (!course) {
    root.innerHTML = `<section class="empty-state panel"><h1>Course not found</h1><p class="muted">Return to Subjects and choose an available course.</p><a class="btn primary" href="index.html#subjects">Browse subjects</a></section>`;
    return;
  }

  document.body.dataset.subject = course.id;
  document.body.dataset.course = course.title;
  const currentUnit = course.units.find(unit => unit.id === unitId) || course.units[0];
  if (currentUnit) document.body.dataset.unit = currentUnit.title;
  const currentLesson = currentUnit?.lessons.find(lesson => lesson.topic === lessonId) || currentUnit?.lessons[0];
  if (currentLesson) document.body.dataset.topic = `${currentLesson.topic} ${currentLesson.title}`;

  function masteryUnit(unit) {
    return {
      id: `${course.id}-${unit.id}`,
      subjectKey: course.id,
      topics: unit.lessons.map(lesson => ({ id: lesson.topic, title: lesson.title })),
      termsForTopic(topic) {
        const lesson = unit.lessons.find(item => item.topic === topic);
        return (lesson?.vocabulary || []).map(item => ({ id: flashId(lesson, item.term) }));
      }
    };
  }

  function unitMastery(unit) {
    return unit.lessons.map(lesson => ({ lesson, ...app.topicMastery(lesson.topic, masteryUnit(unit)) }));
  }

  function courseProgress() {
    const records = course.units.flatMap(unitMastery);
    const measured = records.filter(item => item.score !== null);
    return {
      started: records.filter(item => item.evidence > 0).length,
      total: records.length,
      score: measured.length ? Math.round(measured.reduce((sum, item) => sum + item.score, 0) / measured.length) : null,
      weak: measured.filter(item => item.score < 70).sort((a, b) => a.score - b.score)
    };
  }

  function sourceList(ids) {
    return ids.map(id => globalThis.STUDYSPACE_COURSES.findSource(course, id)).filter(Boolean).map(source => `${badge(source)}${source.url ? `<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a>` : `<span>${esc(source.label)}</span>`}`).join("");
  }

  function breadcrumbs(items) {
    return `<nav class="course-crumbs" aria-label="Breadcrumb">${items.map((item, i) => i === items.length - 1 ? `<span aria-current="page">${esc(item.label)}</span>` : `<a href="${item.href}">${esc(item.label)}</a>`).join("<b>›</b>")}</nav>`;
  }

  function toolBar(unit = null) {
    return `<div class="course-tools" aria-label="Study tools">
      <a href="${toolHref("flashcards", unit)}">🃏 Flashcards</a><a href="${toolHref("quiz", unit)}">⚡ Practice quiz</a><a href="${toolHref("mistakes")}">↻ My mistakes</a>
      <button type="button" data-course-ai>✦ Ask StudySpace AI</button>
    </div>`;
  }

  function bindAI(context) {
    document.querySelectorAll("[data-course-ai]").forEach(button => button.onclick = () => app.openAI(`Tutor Mode for ${course.title}. ${context} Use the visible StudySpace lesson first, keep official-framework scope separate from original explanation, teach one step at a time, then ask one question.`, false));
  }

  function renderCourse() {
    const progress = courseProgress();
    const mistakes = app.mistakesFor(course.id).slice(0, 3);
    const next = course.units.flatMap(unit => unitMastery(unit).map(item => ({ ...item, unit }))).find(item => item.evidence < 3) || { unit: course.units[0], lesson: course.units[0].lessons[0] };
    root.innerHTML = `${breadcrumbs([{ label: "Subjects", href: "index.html#subjects" }, { label: course.title }])}
      <header class="course-hero"><div><div class="eyebrow">${esc(course.courseCode)} · Complete course</div><h1>${course.icon} ${esc(course.title)}</h1><p class="lead">${esc(course.summary)}</p>${course.frameworkStatus === "needs-class-identification" ? `<p class="source-notice"><strong>Exact course mapping still needed:</strong> the lessons below are original computing foundations. Add the course code or syllabus to attach the precise Florida benchmarks and classroom order.</p>` : ""}<div class="actions"><a class="btn primary" href="${lessonHref(next.unit, next.lesson)}">Continue learning →</a><a class="btn" href="${toolHref("quiz")}">Quick review</a></div></div>
      <aside class="course-progress-card"><strong>${progress.score === null ? "—" : `${progress.score}%`}</strong><span>measured mastery</span><p>${progress.started} of ${progress.total} lessons have activity. Scores appear only after enough evidence.</p><div class="progress-track"><i style="width:${Math.round(progress.started / progress.total * 100)}%"></i></div></aside></header>
      ${toolBar()}
      <section><div class="section-head"><div><h2>Course organization</h2><p>Every unit opens to instruction, vocabulary, practice, flashcards, and quizzes.</p></div><span class="badge">${course.units.length} units / strands</span></div><div class="full-unit-grid">${course.units.map(unit => {
        const records = unitMastery(unit), measured = records.filter(item => item.score !== null), score = measured.length ? Math.round(measured.reduce((n, item) => n + item.score, 0) / measured.length) : null;
        return `<a class="full-unit-card" href="${unitHref(unit)}"><div class="full-unit-top"><span>${esc(unit.id)}</span><em>${score === null ? "Not measured" : `${score}% mastery`}</em></div><h3>${esc(unit.title)}</h3><p>${esc(unit.summary)}</p><div class="lesson-count">${unit.lessons.length} complete lessons <b>Open →</b></div></a>`;
      }).join("")}</div></section>
      <section class="course-insights"><article class="panel"><h2>Weak areas</h2>${progress.weak.length ? progress.weak.slice(0, 4).map(item => `<a class="insight-row" href="${lessonHref(course.units.find(unit => unit.lessons.includes(item.lesson)), item.lesson)}"><span>${esc(item.lesson.topic)} ${esc(item.lesson.title)}</span><b>${item.score}%</b></a>`).join("") : `<p class="muted">No measured weak areas yet. Complete a few flashcards or quiz questions to build evidence.</p>`}</article><article class="panel"><h2>Recent mistakes</h2>${mistakes.length ? mistakes.map(item => `<div class="insight-row"><span>${esc(item.concept)}</span><b>${item.laterCorrected ? "Corrected" : "Review"}</b></div>`).join("") : `<p class="muted">Missed questions will appear here with explanations and retry options.</p>`}<a class="link" href="${toolHref("mistakes")}">Open mistake review →</a></article></section>
      <section><div class="section-head"><div><h2>Source registry</h2><p>Official scope, class material, and original StudySpace teaching stay distinguishable.</p></div></div><div class="framework-source-grid">${course.sources.map(source => `<article class="framework-source ${esc(source.type)}"><div>${badge(source)}<strong>${esc(source.label)}</strong></div><p>${esc(source.scope)}</p>${source.url ? `<a class="link" href="${esc(source.url)}" target="_blank" rel="noopener">Open source ↗</a>` : `<span class="muted">${source.status === "needed" ? "Not supplied yet" : "Internal source record"}</span>`}</article>`).join("")}</div></section>`;
    document.title = `${course.title} | StudySpace`;
    bindAI("Help the student select a unit and diagnose what to study next.");
  }

  function renderUnit() {
    const unit = currentUnit;
    const records = unitMastery(unit);
    const started = records.filter(item => item.evidence > 0).length;
    const allVocab = [...new Map(unit.lessons.flatMap(lesson => lesson.vocabulary).map(item => [item.term.toLowerCase(), item])).values()];
    const unitIndex = course.units.indexOf(unit), previous = course.units[unitIndex - 1], next = course.units[unitIndex + 1];
    root.innerHTML = `${breadcrumbs([{ label: course.title, href: `subject.html?s=${q(course.id)}` }, { label: `${unit.id} ${unit.title}` }])}
      <header class="page-head course-unit-head"><div class="eyebrow">${esc(course.title)} · Unit ${esc(unit.id)}</div><h1>${esc(unit.title)}</h1><p class="lead">${esc(unit.summary)}</p><div class="actions"><a class="btn primary" href="${lessonHref(unit, records.find(item => item.evidence < 3)?.lesson || unit.lessons[0])}">Start / continue unit</a><a class="btn" href="#lessons">Browse lessons</a></div></header>
      ${toolBar(unit)}
      <section class="unit-overview-grid"><article class="panel"><div class="eyebrow">Why it matters</div><h2>Build connected understanding</h2><p>${esc(unit.summary)} These ideas matter because later tasks ask you to transfer them to unfamiliar evidence, not simply recognize definitions.</p><h3>Big ideas</h3><ul>${unit.lessons.slice(0, 4).map(lesson => `<li><strong>${esc(lesson.title)}:</strong> ${esc(lesson.sections[0].body)}</li>`).join("")}</ul></article><aside class="panel unit-progress"><strong>${started}/${unit.lessons.length}</strong><span>lessons started</span><div class="progress-track"><i style="width:${Math.round(started / unit.lessons.length * 100)}%"></i></div><p>Mastery is built from saved quiz and flashcard evidence.</p></aside></section>
      <section><div class="section-head"><div><h2>Learning objectives</h2><p>By the end of this unit, you should be able to:</p></div></div><div class="objective-grid">${course.skills.slice(0, 5).map(skill => `<article><span>✓</span><p>${esc(skill)} while using the concepts in ${esc(unit.title)}.</p></article>`).join("")}</div></section>
      <section id="lessons"><div class="section-head"><div><h2>Lessons</h2><p>Each lesson contains instruction, an example, a visual model, leveled practice, and a mastery check.</p></div></div><div class="lesson-list">${records.map((item, i) => `<a class="lesson-row" href="${lessonHref(unit, item.lesson)}"><span class="lesson-number">${esc(item.lesson.topic)}</span><div><h3>${esc(item.lesson.title)}</h3><p>${esc(item.lesson.overview)}</p><small>${esc(item.lesson.sections.map(section => section.title).join(" · "))}</small></div><em class="mastery-chip ${String(item.label).toLowerCase().replace(" ", "-")}">${item.score === null ? esc(item.label) : `${item.score}%`}</em><b>→</b></a>`).join("")}</div></section>
      <section><div class="section-head"><div><h2>Unit vocabulary</h2><p>Key language shared across the lessons.</p></div><a class="btn small" href="${toolHref("flashcards", unit)}">Study as flashcards</a></div><div class="vocab-grid">${allVocab.map(item => `<article><strong>${esc(item.term)}</strong><p>${esc(item.definition)}</p></article>`).join("")}</div></section>
      <section><div class="section-head"><div><h2>Sources and provenance</h2><p>Teacher-specific material is never invented.</p></div></div><div class="source-strip">${sourceList(unit.sourceIds)}</div>${unit.note ? `<p class="source-notice">${esc(unit.note)}</p>` : ""}</section>
      <nav class="unit-pagination">${previous ? `<a href="${unitHref(previous)}">← ${esc(previous.title)}</a>` : `<span></span>`}<a href="subject.html?s=${q(course.id)}">Course home</a>${next ? `<a href="${unitHref(next)}">${esc(next.title)} →</a>` : `<span></span>`}</nav>`;
    document.title = `${unit.title} | ${course.title} | StudySpace`;
    bindAI(`The selected unit is ${unit.id} ${unit.title}.`);
  }

  function visualMarkup(lesson) {
    const labels = {
      "scale-flow": ["Local", "Regional", "National", "Global"], "representation-bridge": ["Context", "Table", "Equation", "Graph"],
      "cause-mechanism-effect": ["Input", "Mechanism", "Response", "Evidence"], "reasoning-chain": ["Information", "Operations", "Inference", "Conclusion"],
      "diagnostic-flow": ["Identify", "Test", "Repair", "Verify"], "input-process-output": ["Input", "Process", "Output", "Evaluate"],
      "claim-evidence-reasoning": ["Claim", "Evidence", "Reasoning", "Revision"], "practice-loop": ["Listen", "Isolate", "Adjust", "Reconnect"]
    }[lesson.visual] || ["Observe", "Explain", "Apply", "Check"];
    return `<div class="concept-visual" data-concept-visual><div class="visual-flow">${labels.map((label, i) => `<button type="button" data-visual-step="${i}"><b>${i + 1}</b>${esc(label)}</button>`).join("<i>→</i>")}</div><p data-visual-output>Select a stage to see how it supports this lesson.</p></div>`;
  }

  function renderLesson() {
    const unit = currentUnit, lesson = currentLesson;
    const idx = unit.lessons.indexOf(lesson), prev = unit.lessons[idx - 1], next = unit.lessons[idx + 1];
    const mastery = app.topicMastery(lesson.topic, masteryUnit(unit));
    root.innerHTML = `${breadcrumbs([{ label: course.title, href: `subject.html?s=${q(course.id)}` }, { label: unit.title, href: unitHref(unit) }, { label: `${lesson.topic} ${lesson.title}` }])}
      <header class="page-head lesson-hero"><div class="eyebrow">${esc(course.title)} · ${esc(unit.id)} · Lesson ${esc(lesson.topic)}</div><h1>${esc(lesson.title)}</h1><p class="lead">${esc(lesson.overview)}</p><div class="lesson-status"><span class="mastery-chip ${String(mastery.label).toLowerCase().replace(" ", "-")}">${mastery.score === null ? esc(mastery.label) : `${mastery.score}% mastery`}</span><span>${mastery.evidence} saved evidence point${mastery.evidence === 1 ? "" : "s"}</span></div></header>
      <nav class="lesson-tabs" aria-label="Lesson sections"><a href="#learn">Learn</a><a href="#example">Example</a><a href="#vocabulary">Vocabulary</a><a href="#practice">Practice</a><a href="#check">Mastery check</a></nav>
      <section id="learn"><div class="section-head"><div><h2>Learn</h2><p>Read for the explanation, then use the model below.</p></div></div><div class="learning-objectives"><strong>Learning targets</strong><ul>${lesson.objectives.map(item => `<li>${esc(item)}</li>`).join("")}</ul></div><div class="teaching-grid">${lesson.sections.map((section, i) => `<article class="teaching-card"><span>0${i + 1}</span><h3>${esc(section.title)}</h3><p>${esc(section.body)}</p></article>`).join("")}</div>${visualMarkup(lesson)}</section>
      <section id="example" class="worked-example"><div><div class="eyebrow">Original StudySpace example</div><h2>See the reasoning in action</h2><p>${esc(lesson.example)}</p><ol>${learning.profiles[course.id].method.map(step => `<li>${esc(step)}</li>`).join("")}</ol></div><aside><strong>Common mistake</strong><p>${esc(lesson.misconception)}</p><button class="btn small" type="button" data-explain-mistake>Explain this mistake</button></aside></section>
      <section id="vocabulary"><div class="section-head"><div><h2>Vocabulary</h2><p>Flip each card, then record whether you know it.</p></div><a class="btn small" href="${toolHref("flashcards", unit)}">Open full deck</a></div><div class="mini-flash-grid">${lesson.vocabulary.map((item, i) => `<button class="mini-flash" type="button" data-mini-flash="${i}" aria-pressed="false"><span><b>${esc(item.term)}</b><small>Tap to reveal</small></span><span><b>${esc(item.definition)}</b><small>Tap to return</small></span></button>`).join("")}</div></section>
      <section id="practice"><div class="section-head"><div><h2>Practice from recall to challenge</h2><p>Reveal one task at a time and explain your reasoning aloud or in writing.</p></div></div><div class="practice-ladder">${lesson.practice.map((item, i) => `<article><button type="button" data-practice="${i}"><span>${i + 1}</span><b>${esc(item.level)}</b><em>Reveal task</em></button><p hidden>${esc(item.prompt)}</p></article>`).join("")}</div></section>
      <section id="check"><div class="section-head"><div><h2>Quick mastery check</h2><p>One saved question gives useful evidence; the unit quiz gives a more stable score.</p></div></div><div class="lesson-check" data-lesson-check></div></section>
      <section><div class="section-head"><div><h2>Sources</h2><p>What defines the scope and what was created by StudySpace.</p></div></div><div class="source-strip">${sourceList(lesson.sources)}</div></section>
      <nav class="unit-pagination">${prev ? `<a href="${lessonHref(unit, prev)}">← ${esc(prev.title)}</a>` : `<a href="${unitHref(unit)}">← Unit overview</a>`}<a href="${unitHref(unit)}">All lessons</a>${next ? `<a href="${lessonHref(unit, next)}">${esc(next.title)} →</a>` : `<a href="${toolHref("quiz", unit)}">Unit quiz →</a>`}</nav>`;
    document.title = `${lesson.topic} ${lesson.title} | ${course.title} | StudySpace`;
    bindLesson(lesson, unit);
  }

  function recordQuestion(lesson, unit, question, picked) {
    const correct = picked === question.answer;
    app.recordQuizAttempt({ subject: course.id, unit: unit.id, topic: lesson.topic, mode: "lesson-check", score: correct ? 1 : 0, total: 1, percentage: correct ? 100 : 0, results: [{ questionId: question.id, topic: lesson.topic, concept: lesson.title, questionType: "lesson-check", question: question.prompt, picked: question.choices[picked], answer: question.choices[question.answer], correct, explanation: question.explanation, mistakeCategory: lesson.misconception }] });
    return correct;
  }

  function bindLesson(lesson, unit) {
    const outputs = [lesson.sections[0].body, lesson.sections[1].body, lesson.example, `Check: ${lesson.misconception}`];
    document.querySelectorAll("[data-visual-step]").forEach(button => button.onclick = () => { document.querySelectorAll("[data-visual-step]").forEach(item => item.classList.toggle("active", item === button)); document.querySelector("[data-visual-output]").textContent = outputs[Number(button.dataset.visualStep)]; });
    document.querySelectorAll("[data-mini-flash]").forEach(button => button.onclick = () => { const pressed = button.getAttribute("aria-pressed") === "true"; button.setAttribute("aria-pressed", String(!pressed)); button.classList.toggle("flipped", !pressed); });
    document.querySelectorAll("[data-practice]").forEach(button => button.onclick = () => { const answer = button.parentElement.querySelector("p"); answer.hidden = !answer.hidden; button.querySelector("em").textContent = answer.hidden ? "Reveal task" : "Hide task"; });
    document.querySelector("[data-explain-mistake]").onclick = () => app.openAI(`Explain this common mistake in ${lesson.topic} ${lesson.title}: ${lesson.misconception} Give a contrasting example, then one quick check.`, false);
    const shell = document.querySelector("[data-lesson-check]"), question = lesson.questions[0];
    shell.innerHTML = `<p class="question-label">${esc(question.prompt)}</p><div class="choices">${question.choices.map((choice, i) => `<button class="btn choice" type="button" data-answer="${i}">${esc(choice)}</button>`).join("")}</div><p class="feedback" aria-live="polite"></p>`;
    shell.querySelectorAll("[data-answer]").forEach(button => button.onclick = () => {
      if (shell.dataset.answered) return;
      shell.dataset.answered = "true";
      const picked = Number(button.dataset.answer), correct = recordQuestion(lesson, unit, question, picked);
      shell.querySelectorAll("[data-answer]").forEach((item, i) => { if (i === question.answer) item.classList.add("correct"); else if (i === picked) item.classList.add("wrong"); });
      shell.querySelector(".feedback").innerHTML = `<strong class="${correct ? "good" : "bad"}">${correct ? "Correct." : "Not yet."}</strong> ${esc(question.explanation)} <a class="link" href="${toolHref("quiz", unit)}">Take the unit quiz →</a>`;
    });
  }

  function deck(unit = null) {
    const units = unit ? [unit] : course.units;
    return units.flatMap(item => item.lessons.flatMap(lesson => lesson.vocabulary.map(card => ({ ...card, id: flashId(lesson, card.term), topic: lesson.topic, lesson, unit: item, subject: course.id }))));
  }

  function renderFlashcards() {
    const unit = unitId ? currentUnit : null;
    const cards = deck(unit), learningOnly = params.get("mode") === "learning";
    let active = learningOnly ? cards.filter(card => app.state.flashcardMastery[card.id]?.status === "learning") : cards;
    if (!active.length) active = cards;
    let index = 0, flipped = false;
    root.innerHTML = `${breadcrumbs([{ label: course.title, href: `subject.html?s=${q(course.id)}` }, ...(unit ? [{ label: unit.title, href: unitHref(unit) }] : []), { label: "Flashcards" }])}<header class="page-head"><div class="eyebrow">${esc(course.title)}${unit ? ` · ${esc(unit.title)}` : " · Full course"}</div><h1>Adaptive <span class="gradient-text">flashcards</span></h1><p class="lead">Flip for a real definition, then sort each card. Your choices update lesson and unit mastery.</p><div class="actions"><button class="btn" type="button" data-shuffle>↻ Shuffle</button><a class="btn" href="${toolHref("flashcards", unit)}&mode=learning">Still learning only</a><a class="btn primary" href="${toolHref("quiz", unit)}">Quiz this scope</a></div></header><div class="flash-area"><div class="stats"><div class="stat"><strong data-card-progress>1/${active.length}</strong><span>Progress</span></div><div class="stat"><strong data-mastered>0</strong><span>Mastered</span></div><div class="stat"><strong data-learning>0</strong><span>Learning</span></div><div class="stat"><strong>${active.length}</strong><span>Cards</span></div></div><button class="flashcard" type="button" data-flash aria-label="Flip flashcard"><span class="flash-inner"><span class="flash-face flash-front"><small class="eyebrow" data-card-topic></small><h2 data-card-term></h2><span class="flash-hint">Tap or press Enter to reveal</span></span><span class="flash-face flash-back"><small class="eyebrow">Definition</small><p data-card-definition></p><p class="example" data-card-example></p><span class="flash-hint">Tap to see the term</span></span></span></button><div class="flash-controls"><button class="btn" type="button" data-prev>← Previous</button><button class="btn" type="button" data-learning-btn>Study again</button><button class="btn primary" type="button" data-mastered-btn>I know this</button><button class="btn" type="button" data-next>Next →</button></div></div>`;
    const draw = () => { const card = active[index]; flipped = false; document.querySelector("[data-flash]").classList.remove("flipped"); document.querySelector("[data-card-progress]").textContent = `${index + 1}/${active.length}`; document.querySelector("[data-card-topic]").textContent = `${card.topic} ${card.lesson.title}`; document.querySelector("[data-card-term]").textContent = card.term; document.querySelector("[data-card-definition]").textContent = card.definition; document.querySelector("[data-card-example]").textContent = `Lesson connection: ${card.lesson.example}`; const status = Object.values(app.state.flashcardMastery).filter(item => item.subject === course.id); document.querySelector("[data-mastered]").textContent = status.filter(item => item.status === "mastered").length; document.querySelector("[data-learning]").textContent = status.filter(item => item.status === "learning").length; };
    const move = delta => { index = (index + delta + active.length) % active.length; draw(); };
    document.querySelector("[data-flash]").onclick = () => { flipped = !flipped; document.querySelector("[data-flash]").classList.toggle("flipped", flipped); };
    document.querySelector("[data-prev]").onclick = () => move(-1); document.querySelector("[data-next]").onclick = () => move(1);
    document.querySelector("[data-learning-btn]").onclick = () => { app.recordFlashcard(active[index], "learning"); move(1); };
    document.querySelector("[data-mastered-btn]").onclick = () => { app.recordFlashcard(active[index], "mastered"); move(1); };
    document.querySelector("[data-shuffle]").onclick = () => { active = active.slice().sort(() => Math.random() - .5); index = 0; draw(); };
    draw(); document.title = `${course.title} Flashcards | StudySpace`;
  }

  function quizQuestions(unit = null) {
    const units = unit ? [unit] : course.units;
    const all = units.flatMap(item => item.lessons.flatMap(lesson => lesson.questions.map(question => ({ ...question, lesson, unit: item }))));
    const topic = params.get("topic");
    const selected = topic ? all.filter(question => question.lesson.topic === topic) : all;
    return selected.sort(() => Math.random() - .5).slice(0, Math.min(Number(params.get("n")) || 12, selected.length));
  }

  function renderQuiz() {
    const unit = unitId ? currentUnit : null, questions = quizQuestions(unit);
    let index = 0, results = [];
    root.innerHTML = `${breadcrumbs([{ label: course.title, href: `subject.html?s=${q(course.id)}` }, ...(unit ? [{ label: unit.title, href: unitHref(unit) }] : []), { label: "Practice quiz" }])}<header class="page-head"><div class="eyebrow">Original StudySpace practice</div><h1>${esc(unit ? unit.title : course.title)} <span class="gradient-text">quiz</span></h1><p class="lead">${questions.length} original questions. Explanations and mistakes save to your mastery record.</p></header><div class="quiz-shell"><div class="quiz-card" data-quiz-card></div></div>`;
    const shell = document.querySelector("[data-quiz-card]");
    const finish = () => {
      const score = results.filter(item => item.correct).length, pct = Math.round(score / results.length * 100);
      app.recordQuizAttempt({ subject: course.id, unit: unit?.id || "full-course", mode: unit ? "unit" : "course", score, total: results.length, percentage: pct, results });
      shell.innerHTML = `<div class="quiz-result"><div class="result-score">${pct}%</div><h2>${score} of ${results.length} correct</h2><p>${pct >= 80 ? "Strong result. Review any explanation you missed, then transfer the skills to a new context." : "Use the missed concepts below as a study plan, then retry."}</p><div class="result-review">${results.filter(item => !item.correct).map(item => `<article><strong>${esc(item.concept)}</strong><p>${esc(item.explanation)}</p></article>`).join("") || `<p class="good">No missed questions in this round.</p>`}</div><div class="actions"><button class="btn primary" type="button" data-retry>Try another set</button><a class="btn" href="${toolHref("mistakes")}">Review mistakes</a>${unit ? `<a class="btn" href="${unitHref(unit)}">Unit overview</a>` : ""}</div></div>`;
      shell.querySelector("[data-retry]").onclick = () => location.reload();
    };
    const draw = () => {
      if (index >= questions.length) return finish();
      const item = questions[index];
      shell.innerHTML = `<div class="quiz-top"><span>Question ${index + 1} of ${questions.length}</span><span>${esc(item.lesson.topic)} ${esc(item.lesson.title)}</span></div><h2>${esc(item.prompt)}</h2><div class="choices">${item.choices.map((choice, i) => `<button class="btn choice" type="button" data-pick="${i}">${esc(choice)}</button>`).join("")}</div><div class="feedback" aria-live="polite"></div><button class="btn primary" type="button" data-continue hidden>Continue →</button>`;
      shell.querySelectorAll("[data-pick]").forEach(button => button.onclick = () => {
        if (shell.dataset.answered === String(index)) return;
        shell.dataset.answered = String(index); const picked = Number(button.dataset.pick), correct = picked === item.answer;
        results.push({ questionId: item.id, topic: item.lesson.topic, concept: item.lesson.title, questionType: "course-practice", question: item.prompt, picked: item.choices[picked], answer: item.choices[item.answer], correct, explanation: item.explanation, mistakeCategory: item.lesson.misconception });
        shell.querySelectorAll("[data-pick]").forEach((choice, i) => { if (i === item.answer) choice.classList.add("correct"); else if (i === picked) choice.classList.add("wrong"); });
        shell.querySelector(".feedback").innerHTML = `<strong class="${correct ? "good" : "bad"}">${correct ? "Correct." : "Not yet."}</strong> ${esc(item.explanation)}`;
        shell.querySelector("[data-continue]").hidden = false;
      });
      shell.querySelector("[data-continue]").onclick = () => { index += 1; draw(); };
    };
    draw(); document.title = `${course.title} Practice Quiz | StudySpace`;
  }

  function renderMistakes() {
    const mistakes = app.mistakesFor(course.id);
    root.innerHTML = `${breadcrumbs([{ label: course.title, href: `subject.html?s=${q(course.id)}` }, { label: "My mistakes" }])}<header class="page-head"><div class="eyebrow">${esc(course.title)}</div><h1>My <span class="gradient-text">mistakes</span></h1><p class="lead">Every missed course-runtime question saves here with the selected answer, correction, explanation, and a path back to practice.</p><div class="actions"><a class="btn primary" href="${toolHref("quiz")}">Practice a new set</a><a class="btn" href="${toolHref("flashcards")}&mode=learning">Study learning cards</a></div></header><section><div class="mistake-list">${mistakes.length ? mistakes.map(item => `<article class="mistake-card ${item.laterCorrected ? "corrected" : ""}"><div class="mistake-head"><span>${esc(item.topic || item.unit)}</span><b>${esc(item.concept)}</b><em>${item.laterCorrected ? "Later corrected" : item.reviewed ? "Reviewed" : "Needs review"}</em></div><p><strong>Question:</strong> ${esc(item.question)}</p><div class="answer-comparison"><p><span>Your answer</span>${esc(item.wrongAnswer)}</p><p><span>Correct answer</span>${esc(item.correctAnswer)}</p></div><p class="example"><strong>Why:</strong> ${esc(item.explanation)}</p><div class="actions"><button class="btn small" type="button" data-review-id="${esc(item.id)}">${item.reviewed ? "Mark unreviewed" : "Mark reviewed"}</button><a class="btn small" href="${toolHref("quiz")}&topic=${q(item.topic || "")}&n=4">Retry concept</a><button class="btn small" type="button" data-ai-mistake="${esc(item.id)}">Ask AI</button></div></article>`).join("") : `<div class="empty-state panel"><h2>No saved mistakes yet</h2><p class="muted">Take a lesson check or course quiz. A missed answer will appear here with an explanation.</p><a class="btn primary" href="${toolHref("quiz")}">Start a quiz</a></div>`}</div></section>`;
    document.querySelectorAll("[data-review-id]").forEach(button => button.onclick = () => { const item = mistakes.find(entry => entry.id === button.dataset.reviewId); app.markMistakeReviewed(item.id, !item.reviewed); renderMistakes(); });
    document.querySelectorAll("[data-ai-mistake]").forEach(button => button.onclick = () => { const item = mistakes.find(entry => entry.id === button.dataset.aiMistake); app.openAI(`Help me understand this ${course.title} mistake. Question: ${item.question}\nMy answer: ${item.wrongAnswer}\nCorrect answer: ${item.correctAnswer}\nExplanation: ${item.explanation}\nTeach the concept, then give one similar original question.`, false); });
    document.title = `${course.title} Mistakes | StudySpace`;
  }

  if (page === "course") renderCourse();
  else if (page === "unit") renderUnit();
  else if (page === "lesson") renderLesson();
  else if (page === "flashcards") renderFlashcards();
  else if (page === "quiz") renderQuiz();
  else if (page === "mistakes") renderMistakes();
})();
