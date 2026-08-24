(function(){
  "use strict";
  const data=globalThis.ALGEBRA2_CHAPTER1,app=globalThis.StudySpace,escape=app.escapeHtml;
  const skills=data.sections.flatMap(section=>section.skills.map(skill=>({section,skill,mastery:app.conceptMastery("algebra2",skill.title)}))).filter(item=>item.mastery.score!==null).sort((a,b)=>a.mastery.score-b.mastery.score);
  const focus=skills[0]?.section||data.sections.find(section=>app.topicMastery(section.id,data.chapter1).evidence<3)||data.sections[0];
  const weakest=skills.find(item=>item.section.id===focus.id);
  document.querySelector("#sessionTopic").textContent=`${focus.id} ${focus.title}`;
  document.querySelector("#sessionReason").textContent=weakest?`${weakest.skill.title} is the lowest measured skill at ${weakest.mastery.score}%. This session reviews the model before similar practice.`:"There is not enough evidence for a weak-skill score yet, so begin with the next unmeasured foundation.";
  document.querySelector("#startSession").href=`algebra2-section.html?s=${focus.id}#visual`;
  const steps=[
    ["1","Visual review","Change one graph control and predict the result before looking.",`algebra2-section.html?s=${focus.id}#visual`],
    ["2","Worked example","Reveal each step and explain why it is valid.",`algebra2-section.html?s=${focus.id}#worked`],
    ["3","Try It","Solve once before using progressive hints.",`algebra2-section.html?s=${focus.id}#try`],
    ["4","Targeted practice","Complete six fresh problems from this section.",`algebra2-practice.html?section=${focus.id}&mode=quick`],
    ["5","Mistake correction","Review the misconception, then retry a similar problem.","algebra2-mistakes.html"],
    ["6","Rule recap","Use quick cards for formulas and interpretation.",`algebra2-flashcards.html?section=${focus.id}`]
  ];
  document.querySelector("#sessionSteps").innerHTML=steps.map(([number,title,text,href])=>`<a class="session-step" href="${href}"><span>${number}</span><div><h3>${escape(title)}</h3><p>${escape(text)}</p></div><b>Open →</b></a>`).join("");
  document.querySelector("#sessionRecap").onclick=()=>app.openAI(`Lead a short Algebra 2 Chapter 1 recap focused on ${focus.id} ${focus.title}. Ask me for one rule I can explain, one mistake I corrected, and one problem type I still need. Ask one question at a time.`);
})();
