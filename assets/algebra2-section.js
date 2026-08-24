(function () {
  "use strict";
  const data = globalThis.ALGEBRA2_CHAPTER1;
  const app = globalThis.StudySpace;
  const math = globalThis.AlgebraMath;
  const escape = app.escapeHtml;
  const params = new URLSearchParams(location.search);
  const id = data.section(params.get("s")) ? params.get("s") : "1.1";
  const section = data.section(id);
  document.body.dataset.subject = "algebra2";
  document.body.dataset.chapter = "1";
  document.body.dataset.section = id;
  document.title = `${id} ${section.title} | StudySpace`;
  document.querySelector("#sectionEyebrow").textContent = `Algebra 2 • Chapter 1 • Section ${id}`;
  document.querySelector("#sectionTitle").textContent = section.title;
  document.querySelector("#sectionDescription").textContent = section.description;
  ["sectionPractice", "morePractice"].forEach(name => document.querySelector(`#${name}`).href = `algebra2-practice.html?section=${id}`);
  const mastery = app.topicMastery(id, data.chapter1);
  document.querySelector("#sectionMastery").textContent = mastery.score === null ? mastery.label : `${mastery.label} · ${mastery.score}%`;

  document.querySelector("#algebraLessons").innerHTML = section.lessons.map((lesson, index) => `<article class="note-section"><div class="eyebrow">Lesson ${index + 1}</div><h2>${escape(lesson.title)}</h2><p>${escape(lesson.summary)}</p><ul>${lesson.keyIdeas.map(idea => `<li>${escape(idea)}</li>`).join("")}</ul><button class="plain-action" type="button" data-section-help data-lesson-ai="${index}">I don't get this</button></article>`).join("");
  document.querySelectorAll("[data-lesson-ai]").forEach(button => button.onclick = () => { const lesson = section.lessons[Number(button.dataset.lessonAi)]; app.openAI(`Algebra 2 ${id} ${section.title}. Explain this more simply with one numeric example, then ask one check question: ${lesson.title} — ${lesson.summary}`); });

  document.querySelector("#workedExamples").innerHTML = section.workedExamples.map((example, exampleIndex) => `<article class="worked-example"><div class="eyebrow">Worked example ${exampleIndex + 1}</div><h3>${escape(example.prompt)}</h3><div class="worked-steps" data-worked="${exampleIndex}"></div><button class="btn small" type="button" data-reveal="${exampleIndex}">Reveal step 1</button></article>`).join("");
  const revealed = section.workedExamples.map(() => 0);
  document.querySelectorAll("[data-reveal]").forEach(button => button.onclick = () => {
    const exampleIndex = Number(button.dataset.reveal), example = section.workedExamples[exampleIndex], box = document.querySelector(`[data-worked="${exampleIndex}"]`);
    if (revealed[exampleIndex] < example.steps.length) {
      box.insertAdjacentHTML("beforeend", `<p><span>${revealed[exampleIndex] + 1}</span>${escape(example.steps[revealed[exampleIndex]])}</p>`);
      revealed[exampleIndex] += 1;
      button.textContent = revealed[exampleIndex] < example.steps.length ? `Reveal step ${revealed[exampleIndex] + 1}` : "Reveal answer";
    } else { box.insertAdjacentHTML("beforeend", `<p class="worked-answer"><strong>Answer</strong>${escape(example.answer)}</p>`); button.remove(); }
  });

  function slider(name, label, min, max, value, step = 1) { return `<label>${label}<input type="range" data-param="${name}" min="${min}" max="${max}" value="${value}" step="${step}"><output data-output="${name}">${value}</output></label>`; }
  const visual = document.querySelector("#interactiveVisual");
  function graphExplorer(family = "absolute", extras = "") {
    visual.innerHTML = `<div class="math-lab-grid"><div><div class="math-controls"><label>Parent family<select data-family><option value="constant">Constant</option><option value="linear">Linear</option><option value="absolute" ${family === "absolute" ? "selected" : ""}>Absolute value</option><option value="quadratic">Quadratic</option></select></label>${slider("a", "Outside factor a", -3, 3, 1, .5)}${slider("b", "Inside factor b", -3, 3, 1, .5)}${slider("h", "Horizontal shift h", -5, 5, 0)}${slider("k", "Vertical shift k", -5, 5, 0)}</div><div class="equation-readout" data-equation></div>${extras}</div><div class="math-graph" data-graph></div></div>`;
    const draw = () => {
      const values = Object.fromEntries([...visual.querySelectorAll("[data-param]")].map(input => { const value = Number(input.value) || (input.dataset.param === "b" ? .5 : 0); visual.querySelector(`[data-output="${input.dataset.param}"]`).value = input.value; return [input.dataset.param, value]; }));
      const selected = visual.querySelector("[data-family]").value;
      visual.querySelector("[data-equation]").textContent = `g(x) = ${values.a} · f(${values.b}(x − ${values.h})) + ${values.k}; horizontal scale = ${Math.round(100 / Math.abs(values.b)) / 100}`;
      const timeline = visual.querySelector("[data-timeline]");
      if (timeline) timeline.innerHTML = `<span>Parent f(x)</span><b>→</b><span>Input: ${values.b}(x−${values.h})</span><b>→</b><span>Output: ×${values.a}</span><b>→</b><span>Final: ${values.k >= 0 ? "+" : ""}${values.k}</span>`;
      math.renderFunctionGraph(visual.querySelector("[data-graph]"), { family: selected, ...values });
    };
    visual.oninput = draw; draw();
  }

  function buildVisual() {
    if (["1.1", "1.2", "1.5"].includes(id)) {
      graphExplorer(id === "1.5" ? "absolute" : id === "1.1" ? "quadratic" : "linear", id === "1.2" ? `<p class="memory-cue">Inside factors use the reciprocal: b=2 means a horizontal scale of 1/2.</p><div class="transformation-timeline" data-timeline aria-label="Transformation timeline"></div>` : "");
      if (id === "1.1") {
        const families = [
          ["constant","Constant","f(x)=1","horizontal line","all real numbers","y=1","M5 20 L55 20"],
          ["linear","Linear","f(x)=x","straight line","all real numbers","all real numbers","M5 36 L55 5"],
          ["absolute","Absolute Value","f(x)=|x|","V shape","all real numbers","y≥0","M5 5 L30 36 L55 5"],
          ["quadratic","Quadratic","f(x)=x²","U-shaped parabola","all real numbers","y≥0","M6 5 Q30 55 54 5"]
        ];
        visual.insertAdjacentHTML("beforeend", `<div class="parent-gallery" aria-label="Parent function comparison">${families.map(([key,name,rule,shape,domain,range,path])=>`<button type="button" data-family-pick="${key}"><strong>${name}</strong><span>${rule}</span><svg viewBox="0 0 60 40" role="img" aria-label="Mini graph: ${shape}"><path d="${path}"></path></svg><small>${shape}<br>Domain: ${domain}<br>Range: ${range}</small></button>`).join("")}</div>`);
        visual.addEventListener("click", event => { const button=event.target.closest("[data-family-pick]"); if(!button)return; visual.querySelector("[data-family]").value=button.dataset.familyPick; visual.querySelector("[data-family]").dispatchEvent(new Event("input",{bubbles:true})); visual.querySelectorAll("[data-family-pick]").forEach(item=>item.classList.toggle("active",item===button)); });
      }
      if (id === "1.5") {
        visual.insertAdjacentHTML("beforeend", `<div class="graph-analysis"><strong>Analyze before revealing</strong><p>Select a feature to reveal what the current a, h, and k control.</p><div class="actions"><button class="btn small" type="button" data-feature="vertex">Vertex</button><button class="btn small" type="button" data-feature="symmetry">Symmetry</button><button class="btn small" type="button" data-feature="range">Range / extremum</button></div><p data-feature-answer aria-live="polite"></p></div>`);
        visual.addEventListener("click", event => { const button=event.target.closest("[data-feature]"); if(!button)return; const p=Object.fromEntries([...visual.querySelectorAll("[data-param]")].map(input=>[input.dataset.param,Number(input.value)]));const answers={vertex:`Vertex: (${p.h}, ${p.k})`,symmetry:`Line of symmetry: x=${p.h}`,range:p.a>=0?`Minimum ${p.k}; range y≥${p.k}`:`Maximum ${p.k}; range y≤${p.k}`};visual.querySelector("[data-feature-answer]").textContent=answers[button.dataset.feature]; });
      }
    } else if (id === "1.3") {
      const points = [[1,3],[2,4],[3,7],[4,6],[5,9],[6,10],[7,11],[8,13]];
      visual.innerHTML = `<div class="math-lab-grid"><div class="math-controls"><label>Which form should I use?<select data-linear-form><option value="slope and y-intercept → y=mx+b">Slope and y-intercept</option><option value="slope and one point → point-slope">Slope and one point</option><option value="two points → find slope, then point-slope">Two points</option></select></label><div class="memory-cue" data-form-help>slope and y-intercept → y=mx+b</div>${slider("m", "Slope m", 0, 3, 1.4, .1)}${slider("b", "Intercept b", -3, 6, 1, .5)}<div class="model-balance" data-balance></div><p class="memory-cue">A reasonable hand-fit line balances points above and below. The chosen points may lie on the fitted line instead of the data.</p></div><div class="math-graph" data-graph></div></div>`;
      const draw = () => { const m = Number(visual.querySelector('[data-param="m"]').value), b = Number(visual.querySelector('[data-param="b"]').value); visual.querySelector('[data-output="m"]').value=m; visual.querySelector('[data-output="b"]').value=b; const count = math.renderScatter(visual.querySelector("[data-graph]"), points, {m,b}); visual.querySelector("[data-balance]").textContent=`y=${m}x+${b} · ${count.above} above · ${count.below} below · ${count.on} on`; }; visual.oninput=draw; draw();
      visual.querySelector("[data-linear-form]").onchange=event=>visual.querySelector("[data-form-help]").textContent=event.target.value;
    } else if (id === "1.4") {
      visual.innerHTML = `<div class="math-controls inline"><label>Solution region<select data-mode><option value="between">Less than → between / AND</option><option value="outside">Greater than → outside / OR</option></select></label>${slider("boundary", "Distance c", 1, 9, 4)}<label class="check-label"><input type="checkbox" data-inclusive> Include endpoints (≤ or ≥)</label></div><div class="equation-readout" data-equation></div><div class="math-graph" data-graph></div>`;
      const draw=()=>{ const boundary=Number(visual.querySelector('[data-param="boundary"]').value), mode=visual.querySelector('[data-mode]').value, inclusive=visual.querySelector('[data-inclusive]').checked; visual.querySelector('[data-output="boundary"]').value=boundary; visual.querySelector('[data-equation]').textContent=mode==="between"?`|x| ${inclusive?"≤":"<"} ${boundary} → ${-boundary} ${inclusive?"≤":"<"} x ${inclusive?"≤":"<"} ${boundary}`:`|x| ${inclusive?"≥":">"} ${boundary} → x ${inclusive?"≤":"<"} ${-boundary} OR x ${inclusive?"≥":">"} ${boundary}`; math.renderNumberLine(visual.querySelector('[data-graph]'),{boundary,mode,inclusive});}; visual.oninput=draw; visual.onchange=draw; draw();
    } else {
      visual.innerHTML = `<div class="math-lab-grid"><div class="math-controls"><label>Graph model<select data-piece-model><option value="linear">Two linear pieces</option><option value="step">Step function</option></select></label><div class="piece-toggles"><label><input type="checkbox" data-show-first checked> Show first piece</label><label><input type="checkbox" data-show-second checked> Show second piece</label></div>${slider("x", "Test input x", -6, 6, -2)}<div class="piece-selector" data-piece></div><label>Evaluate the selected rule<input type="text" data-piece-input inputmode="numeric" placeholder="Enter f(x)"></label><button class="btn small" type="button" data-piece-check>Check evaluation</button><p class="feedback" data-piece-feedback aria-live="polite"></p><p class="memory-cue">StudySpace highlights the true condition and rule. You still perform the substitution.</p></div><div class="math-graph" data-graph></div></div>`;
      const settings=()=>{const step=visual.querySelector('[data-piece-model]').value==="step";return step?{first:()=>2,second:()=>5,firstLabel:"y=2 for x<1",secondLabel:"y=5 for x≥1"}:{first:x=>x+3,second:x=>-x+5,firstLabel:"y=x+3 for x<1",secondLabel:"y=-x+5 for x≥1"};};
      const draw=()=>{const x=Number(visual.querySelector('[data-param="x"]').value),rules=settings(),first=x<1;visual.querySelector('[data-output="x"]').value=x;visual.querySelector('[data-piece]').innerHTML=`<strong>${first?"x < 1 is true":"x ≥ 1 is true"}</strong><span>Selected rule: ${(first?rules.firstLabel:rules.secondLabel).split(" for ")[0].replace("y=","")}</span>`;visual.querySelector('[data-piece-input]').value="";visual.querySelector('[data-piece-feedback]').textContent="";math.renderPiecewise(visual.querySelector('[data-graph]'),{...rules,showFirst:visual.querySelector('[data-show-first]').checked,showSecond:visual.querySelector('[data-show-second]').checked});};visual.querySelector('[data-param="x"]').oninput=draw;visual.querySelector('[data-piece-model]').onchange=draw;visual.querySelectorAll('.piece-toggles input').forEach(input=>input.onchange=draw);visual.querySelector('[data-piece-check]').onclick=()=>{const x=Number(visual.querySelector('[data-param="x"]').value),rules=settings(),expected=x<1?rules.first(x):rules.second(x),picked=Number(visual.querySelector('[data-piece-input]').value);visual.querySelector('[data-piece-feedback]').textContent=Number.isFinite(picked)&&picked===expected?"Correct — the selected rule evaluates to that output.":"Not yet. Substitute x into the highlighted rule and simplify.";};draw();
    }
  }
  buildVisual();
  document.querySelector("#explainGraph").onclick = () => app.openAI(`Explain the interactive visual on Algebra 2 Section ${id}, ${section.title}. Use the current control summary: ${visual.innerText.slice(0, 900)}. Describe what changed, why, and ask me one prediction question.`);

  globalThis.AlgebraPracticeEngine.mount(document.querySelector("#sectionTryIt"), { topic: id, mode: "section-try", onAnswered: () => renderMastery() });
  function renderMastery() {
    document.querySelector("#algebraSkillMastery").innerHTML = section.skills.map(skill => { const item=app.conceptMastery("algebra2", skill.title), cls=item.label.toLowerCase().replaceAll(" ", "-"); return `<article><div class="mastery-top"><span>${escape(skill.title)}</span><strong>${item.score === null ? "—" : `${item.score}%`}</strong></div><p>${escape(skill.summary)}</p><span class="mastery-chip ${cls}">${escape(item.label)}</span></article>`; }).join("");
  }
  renderMastery();
  const current=data.sections.findIndex(item=>item.id===id), prev=data.sections[current-1], next=data.sections[current+1];
  document.querySelector("#algebraPagination").innerHTML=`${prev?`<a href="algebra2-section.html?s=${prev.id}">← ${prev.id} ${escape(prev.title)}</a>`:`<a href="algebra2.html">← Chapter hub</a>`}${next?`<a href="algebra2-section.html?s=${next.id}">${next.id} ${escape(next.title)} →</a>`:`<a href="algebra2-practice.html?mode=mixed">Mixed review →</a>`}`;
  document.querySelector("#studyAlgebraSection").onclick=()=>app.studyThis({title:`${id} ${section.title}`,source:"Original StudySpace Algebra 2 learning sequence",text:[section.description,...section.lessons.map(item=>`${item.title}: ${item.summary} ${item.keyIdeas.join("; ")}`)].join("\n")});
  document.querySelector("#askAlgebra").onclick=()=>app.openAI(`Tutor Mode: Help me with Algebra 2 Section ${id}, ${section.title}. Ask which skill is confusing, teach with a worked numeric example, then let me try before giving the answer.`);
})();
