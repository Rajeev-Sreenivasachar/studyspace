(function () {
  "use strict";
  const data = globalThis.ALGEBRA2_CHAPTER1;
  const app = globalThis.StudySpace;
  const params = new URLSearchParams(location.search);
  const shell = document.querySelector("#algebraPracticeShell");
  const validModes = ["quick", "standard", "mixed", "weak", "mistakes"];
  if (params.get("mode") && validModes.includes(params.get("mode"))) document.querySelector(`[name="practiceMode"][value="${params.get("mode")}"]`).checked = true;
  if (data.section(params.get("section"))) document.querySelector("#algebraSectionFilter").value = params.get("section");
  document.querySelector(".quiz-builder .badge").textContent = `${Object.values(data.generatorTypes).reduce((sum, count) => sum + count, 0)} generator templates`;

  function questionWithDifficulty(topic, difficulty, concept) {
    let question = data.generate(topic, { concept });
    for (let tries = 0; difficulty !== "all" && question.difficulty !== difficulty && tries < 18; tries += 1) question = data.generate(topic, { concept });
    return question;
  }

  function build(mode, section, difficulty) {
    const count = mode === "quick" ? 6 : 12;
    if (mode === "mixed") return Array.from({ length: count }, (_, index) => questionWithDifficulty(data.sections[index % 6].id, difficulty));
    if (mode === "weak") {
      const weak = data.sections.flatMap(item => item.skills.map(skill => ({ section: item.id, skill: skill.title, mastery: app.conceptMastery("algebra2", skill.title) }))).filter(item => item.mastery.score === null || item.mastery.score < 80).sort((a,b)=>(a.mastery.score??-1)-(b.mastery.score??-1));
      const pool = weak.length ? weak : data.sections.flatMap(item => item.skills.map(skill => ({section:item.id,skill:skill.title})));
      return Array.from({length:count},(_,index)=>{const item=pool[index%pool.length];return questionWithDifficulty(item.section,difficulty,item.skill);});
    }
    if (mode === "mistakes") {
      const mistakes = app.mistakesFor("algebra2");
      if (!mistakes.length) return [];
      return Array.from({length:Math.min(count,Math.max(6,mistakes.length))},(_,index)=>{const item=mistakes[index%mistakes.length];return questionWithDifficulty(item.topic,difficulty,item.concept);});
    }
    return Array.from({ length: count }, () => questionWithDifficulty(section, difficulty));
  }

  function start() {
    const mode = document.querySelector('[name="practiceMode"]:checked').value;
    const section = document.querySelector("#algebraSectionFilter").value;
    const difficulty = document.querySelector("#algebraDifficulty").value;
    const questions = build(mode, section, difficulty);
    const message = document.querySelector("#algebraBuilderMessage");
    if (!questions.length) { message.textContent = "No saved Algebra 2 mistakes yet. Start a regular set first, then missed concepts will appear here."; return; }
    message.textContent = "";
    document.querySelector("#algebraPracticeBuilder").hidden = true;
    shell.hidden = false;
    let index = 0, answered = false;
    const results = [];
    function show() {
      answered = false;
      shell.innerHTML = `<div class="practice-progress"><div><span>Problem ${index + 1} of ${questions.length}</span><strong>${results.filter(result=>result.correct).length} correct so far</strong></div><progress max="${questions.length}" value="${index}">${index}/${questions.length}</progress></div><div id="practiceProblem"></div><div class="practice-nav"><button class="btn primary" type="button" id="nextPractice" disabled>${index === questions.length - 1 ? "Finish set" : "Next problem →"}</button></div>`;
      globalThis.AlgebraPracticeEngine.mount(document.querySelector("#practiceProblem"), { question: questions[index], mode, onAnswered(result) { if (!answered) results.push(result); answered=true; document.querySelector("#nextPractice").disabled=false; } });
      document.querySelector("#nextPractice").onclick = () => { if (index < questions.length - 1) { index += 1; show(); } else finish(); };
      shell.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
    }
    function finish() {
      const correct=results.filter(result=>result.correct).length, percent=Math.round(correct/questions.length*100), missed=results.filter(result=>!result.correct);
      shell.innerHTML=`<section class="results-card"><div class="eyebrow">Practice complete</div><h2>${correct} of ${questions.length} correct · ${percent}%</h2><p>${percent>=80?"Strong work. Explain one answer aloud to lock it in.":"Use the saved mistake categories as your next practice targets."}</p>${missed.length?`<div class="result-breakdown"><h3>Concepts to revisit</h3>${missed.map(item=>`<p><strong>${app.escapeHtml(item.topic)} · ${app.escapeHtml(item.concept)}</strong><span>${app.escapeHtml(item.mistakeCategory)}</span></p>`).join("")}</div>`:"<p class=\"feedback correct\">No missed problems in this set.</p>"}<div class="actions"><button class="btn primary" id="retrySet" type="button">New similar set</button><a class="btn" href="algebra2-mistakes.html">Review mistakes</a><a class="btn" href="algebra2.html">Chapter dashboard</a></div></section>`;
      document.querySelector("#retrySet").onclick=()=>{document.querySelector("#algebraPracticeBuilder").hidden=false;shell.hidden=true;shell.innerHTML="";};
    }
    show();
  }
  document.querySelector("#startAlgebraPractice").onclick=start;
  if (params.has("mode") || params.has("section")) start();
})();
