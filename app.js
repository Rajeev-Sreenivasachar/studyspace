const SUBJECTS={
  algebra2:["Algebra 2 Honors","➗"],biology:["Biology 1 Honors","🧬"],english:["English 1 Honors","📖"],
  "csit-foundations":["CSIT Foundations","💻"],"csit-essentials":["CSIT Essentials","🖥️"],
  orchestra:["Orchestra 1","🎻"],"thinking-skills":["AICE Thinking Skills","💡"]
};

function siteNav(back=""){
  return `<a class="skip" href="#main">Skip to content</a><nav class="site-nav"><a class="brand" href="index.html" aria-label="StudySpace home"><span class="logo" aria-hidden="true">S</span><span>StudySpace</span></a><div class="navlinks"><a href="index.html#subjects">Subjects</a><a href="aphg.html">AP Human Geography</a>${back?`<a href="${back}">Back</a>`:""}</div></nav>`;
}

function footer(){return `<footer>StudySpace • built for students who are ready to lock in</footer>`}

function loadChatbot(){
  if(!document.querySelector('link[href="assets/chatbot.css"]')){
    const css=document.createElement("link");css.rel="stylesheet";css.href="assets/chatbot.css";document.head.appendChild(css);
  }
  if(!document.querySelector('script[src="assets/chatbot.js"]')){
    const script=document.createElement("script");script.src="assets/chatbot.js";document.body.appendChild(script);
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("[data-nav]").forEach(el=>el.innerHTML=siteNav(el.dataset.back||""));
  document.querySelectorAll("[data-footer]").forEach(el=>el.innerHTML=footer());
  loadChatbot();
});
