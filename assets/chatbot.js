(()=>{
  "use strict";
  const PREFIX="studyspace-ai-history-v2:",MAX_STORED=12,CONTEXT_LIMIT=6000,SCROLL_AMOUNT=.7;
  const ROUTES=[
    {label:"StudySpace home",path:"index.html"},{label:"AP Human Geography hub",path:"aphg.html"},
    {label:"APHG flashcards",path:"aphg-flashcards.html"},{label:"APHG quick review",path:"aphg-review.html"},{label:"APHG practice quiz",path:"aphg-quiz.html"},
    {label:"CSIT Essentials hub",path:"csit-essentials.html"},{label:"CSIT Module 1 notes",path:"csit-module1.html"},
    {label:"CSIT flashcards",path:"csit-module1-flashcards.html"},{label:"CSIT practice quiz",path:"csit-module1-quiz.html"},
    {label:"APHG Topic 1.1 notes",path:"aphg-topic.html?t=1.1"},{label:"APHG Topic 1.6 notes",path:"aphg-topic.html?t=1.6"},
    {label:"Smart Study Planner",path:"planner.html"},{label:"Study This / Import",path:"study.html"}
  ];
  function scopeForPage(){
    const path=location.pathname.toLowerCase(),query=new URLSearchParams(location.search),subject=query.get("s");
    if(path.includes("aphg"))return {key:"aphg",label:"AP Human Geography"};
    if(path.includes("csit"))return {key:"csit",label:"CSIT Essentials"};
    if(subject)return {key:`subject-${subject}`,label:subject.replaceAll("-"," ").replace(/\b\w/g,x=>x.toUpperCase())};
    return {key:"general",label:"General StudySpace"};
  }
  const scope=scopeForPage(),storageKey=PREFIX+scope.key;
  let history=[],waiting=false,lastRequest="",attachment=null;
  function loadHistory(){try{const saved=JSON.parse(localStorage.getItem(storageKey)||"[]");return Array.isArray(saved)?saved.filter(x=>["user","assistant"].includes(x?.role)&&typeof x?.content==="string").slice(-MAX_STORED):[]}catch{return []}}
  history=loadHistory();

  document.body.insertAdjacentHTML("beforeend",`<button class="ssai-toggle" id="ssaiToggle" aria-label="Open StudySpace AI" aria-expanded="false" aria-controls="ssaiPanel">✦</button><aside class="ssai-panel" id="ssaiPanel" role="dialog" aria-modal="false" aria-labelledby="ssaiTitle"><header class="ssai-head"><div class="ssai-title"><span class="ssai-mark" aria-hidden="true">✦</span><div><strong id="ssaiTitle">StudySpace AI</strong><span id="ssaiScope"></span></div></div><div class="ssai-head-actions"><button class="ssai-clear" id="ssaiNew" type="button">＋ New</button><button class="ssai-clear" id="ssaiClearAll" type="button">Clear all</button><button class="ssai-close" id="ssaiClose" type="button" aria-label="Close StudySpace AI">×</button></div></header><div class="ssai-tools"><label class="ssai-sr" for="ssaiRoute">Go to a StudySpace resource</label><select id="ssaiRoute"><option value="">Navigate to…</option>${ROUTES.map(x=>`<option value="${x.path}">${x.label}</option>`).join("")}</select><button type="button" id="ssaiGo">Go</button><button type="button" id="ssaiUp" aria-label="Scroll page up">↑</button><button type="button" id="ssaiDown" aria-label="Scroll page down">↓</button></div><div class="ssai-modes" aria-label="Tutor mode actions"><button type="button" data-tutor="Teach me">Teach Me</button><button type="button" data-tutor="Quiz me">Quiz Me</button><button type="button" data-tutor="Explain simpler">Explain Simpler</button><button type="button" data-tutor="Give an example">Give Example</button><button type="button" data-tutor="Try another question">Try Another</button></div><div class="ssai-messages" id="ssaiMessages" aria-live="polite" aria-label="Conversation"></div><form class="ssai-form" id="ssaiForm"><div class="ssai-attachment" id="ssaiAttachment" hidden><img id="ssaiPreview" alt="Screenshot preview"><span id="ssaiFileName"></span><button type="button" id="ssaiRemove" aria-label="Remove attached screenshot">×</button></div><div class="ssai-input-row"><input class="ssai-sr" id="ssaiFile" type="file" accept="image/png,image/jpeg,image/webp"><button class="ssai-attach" id="ssaiAttach" type="button" aria-label="Attach a screenshot">📎</button><label class="ssai-sr" for="ssaiInput">Message StudySpace AI</label><textarea class="ssai-input" id="ssaiInput" rows="1" maxlength="3500" placeholder="Ask, or say “quiz me on Topic 1.6”…"></textarea><button class="ssai-send" id="ssaiSend" type="submit">Send</button></div><p class="ssai-note">Source-aware help • Chats save separately by subject</p></form></aside>`);

  const $=selector=>document.querySelector(selector),toggle=$("#ssaiToggle"),panel=$("#ssaiPanel"),close=$("#ssaiClose"),newChat=$("#ssaiNew"),clearAll=$("#ssaiClearAll"),messages=$("#ssaiMessages"),form=$("#ssaiForm"),input=$("#ssaiInput"),send=$("#ssaiSend"),fileInput=$("#ssaiFile"),attach=$("#ssaiAttach"),attachmentBox=$("#ssaiAttachment"),preview=$("#ssaiPreview"),fileName=$("#ssaiFileName"),remove=$("#ssaiRemove"),route=$("#ssaiRoute"),go=$("#ssaiGo"),up=$("#ssaiUp"),down=$("#ssaiDown"),tutorButtons=[...document.querySelectorAll("[data-tutor]")];
  $("#ssaiScope").textContent=`${scope.label} chat • Gemini`;

  function save(){try{localStorage.setItem(storageKey,JSON.stringify(history.slice(-MAX_STORED)))}catch{}}
  function scrollChat(){messages.scrollTop=messages.scrollHeight}
  function bubble(content,role,store=false){const el=document.createElement("div");el.className=`ssai-message ${role}`;el.textContent=content;messages.appendChild(el);if(store){history.push({role:role==="ai"?"assistant":"user",content});history=history.slice(-MAX_STORED);save()}scrollChat();return el}
  function render(){messages.replaceChildren();if(!history.length)bubble(`Hi! This is your ${scope.label} chat. Ask about this page, attach a screenshot, choose a resource above, or say “scroll down.”`,"ai");else history.forEach(x=>bubble(x.content,x.role==="assistant"?"ai":"user"));scrollChat()}
  function setOpen(open){panel.classList.toggle("open",open);toggle.setAttribute("aria-expanded",String(open));if(open){input.focus();scrollChat()}else toggle.focus()}
  function setWaiting(value){waiting=value;[send,input,newChat,clearAll,attach,remove,go,up,down,route,...tutorButtons].forEach(el=>el.disabled=value)}
  function clearAttachment(){attachment=null;fileInput.value="";preview.removeAttribute("src");fileName.textContent="";attachmentBox.hidden=true}
  function resetCurrent(){if(waiting)return;history=[];lastRequest="";clearAttachment();localStorage.removeItem(storageKey);render();input.focus()}
  function clearEveryChat(){if(waiting)return;for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key?.startsWith(PREFIX)||key==="studyspace-ai-history-v1")localStorage.removeItem(key)}history=[];clearAttachment();render();bubble("All saved subject chats were cleared.","ai");input.focus()}
  function selectImage(file,prompt=""){if(!file)return;if(!["image/png","image/jpeg","image/webp"].includes(file.type)){bubble("Use a PNG, JPEG, or WebP screenshot.","ai error");return clearAttachment()}if(file.size>2_500_000){bubble("That screenshot is too large. Choose one under 2.5 MB.","ai error");return clearAttachment()}const reader=new FileReader();reader.onload=()=>{const result=String(reader.result||""),comma=result.indexOf(",");if(comma<0)return clearAttachment();attachment={mimeType:file.type,data:result.slice(comma+1)};preview.src=result;fileName.textContent=file.name;attachmentBox.hidden=false;setOpen(true);if(prompt)input.value=prompt;input.focus()};reader.onerror=()=>{bubble("I couldn't read that screenshot. Please try another image.","ai error");clearAttachment()};reader.readAsDataURL(file)}
  function typing(){const el=document.createElement("div");el.className="ssai-message ai ssai-typing";el.setAttribute("aria-label","StudySpace AI is typing");el.innerHTML="<i></i><i></i><i></i>";messages.appendChild(el);scrollChat();return el}
  function pageContext(){const main=document.querySelector("main");if(!main)return "";const clone=main.cloneNode(true);clone.querySelectorAll("script,style,button,input,textarea,select,.ssai-panel").forEach(el=>el.remove());return (clone.innerText||clone.textContent||"").replace(/\s+/g," ").trim().slice(0,CONTEXT_LIMIT)}
  function navigate(path,label){bubble(`Opening ${label}…`,"ai",true);setTimeout(()=>{location.href=path},350)}
  function localCommand(message){
    const text=message.toLowerCase().trim(),record=reply=>{bubble(message,"user",true);bubble(reply,"ai",true)};
    if(/^(scroll\s+)?down\b|scroll down/.test(text)){record("Scrolling down 70% of the page.");window.scrollBy({top:innerHeight*SCROLL_AMOUNT,behavior:"smooth"});return true}
    if(/^(scroll\s+)?up\b|scroll up/.test(text)){record("Scrolling up 70% of the page.");window.scrollBy({top:-innerHeight*SCROLL_AMOUNT,behavior:"smooth"});return true}
    if(/(go|scroll).*(top)|^top$/.test(text)){record("Going to the top of the page.");window.scrollTo({top:0,behavior:"smooth"});return true}
    if(/(go|scroll).*(bottom)|^bottom$/.test(text)){record("Going to the bottom of the page.");window.scrollTo({top:document.documentElement.scrollHeight,behavior:"smooth"});return true}
    const topicMatch=text.match(/(?:topic\s*)?(1\.[1-7])/);
    if(/quiz me|practice/.test(text)&&topicMatch){bubble(message,"user",true);return navigate(`aphg-quiz.html?mode=topic&topic=${topicMatch[1]}`,`Topic ${topicMatch[1]} quiz`)||true}
    if(/study my mistakes|mistake quiz|retry missed/.test(text)){bubble(message,"user",true);return navigate("aphg-quiz.html?mode=mistakes","mistake quiz")||true}
    if(/study.*weak|weakest topic/.test(text)){bubble(message,"user",true);return navigate("aphg-flashcards.html?mode=weak","weak-topic flashcards")||true}
    if(/help me study for|study plan|upcoming test/.test(text)){bubble(message,"user",true);return navigate("planner.html","Smart Study Planner")||true}
    const minutes=text.match(/start.*?(\d{1,2})\s*(?:minute|min)/);
    if(minutes){bubble(message,"user",true);return navigate(`index.html?minutes=${Math.min(60,Math.max(1,Number(minutes[1])))}&focusTask=${encodeURIComponent("StudySpace focus session")}#focus`,`${minutes[1]}-minute focus session`)||true}
    if(!/\b(open|go to|navigate|take me|show me|start)\b/.test(text))return false;
    let target=null;
    if(/home|homepage/.test(text))target=ROUTES[0];
    else if(/aphg|human geography/.test(text)){if(/flash/.test(text))target=ROUTES[2];else if(/review|notes|guide/.test(text))target=ROUTES[3];else if(/quiz|test/.test(text))target=ROUTES[4];else target=ROUTES[1]}
    else if(/csit|computer|hardware|module 1/.test(text)){if(/flash/.test(text))target=ROUTES[7];else if(/quiz|test/.test(text))target=ROUTES[8];else if(/notes|module/.test(text))target=ROUTES[6];else target=ROUTES[5]}
    else if(/flash/.test(text))target=location.pathname.includes("aphg")?ROUTES[2]:location.pathname.includes("csit")?ROUTES[7]:null;
    else if(/quiz|test/.test(text))target=location.pathname.includes("aphg")?ROUTES[4]:location.pathname.includes("csit")?ROUTES[8]:null;
    if(!target)return false;bubble(message,"user",true);navigate(target.path,target.label);return true;
  }
  async function ask(message,image){const prompt=message||"Please help me understand this screenshot.";if(!image&&localCommand(prompt))return;const fingerprint=`${location.pathname}\n${prompt}\n${image?.data?.slice(0,24)||""}`;if(waiting||fingerprint===lastRequest)return;lastRequest=fingerprint;setWaiting(true);bubble(`${prompt}${image?"\n📷 Screenshot attached":""}`,"user",true);clearAttachment();const loading=typing();try{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000),response=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:prompt,image,history:history.slice(0,-1).slice(-10),pageTitle:document.title,pagePath:location.pathname,pageContext:pageContext()}),signal:controller.signal});clearTimeout(timer);let data={};try{data=await response.json()}catch{}loading.remove();if(!response.ok)throw new Error(data.error||"StudySpace AI is unavailable right now.");bubble(data.reply||"I couldn't create a response. Please try again.","ai",true)}catch(error){loading.remove();bubble(error?.name==="AbortError"?"That took too long. Please try a shorter question.":error?.message||"StudySpace AI is unavailable right now. Please try again later.","ai error")}finally{lastRequest="";setWaiting(false);input.focus()}}

  toggle.addEventListener("click",()=>setOpen(!panel.classList.contains("open")));close.addEventListener("click",()=>setOpen(false));document.addEventListener("keydown",event=>{if(event.key==="Escape"&&panel.classList.contains("open"))setOpen(false)});
  form.addEventListener("submit",event=>{event.preventDefault();const value=input.value.trim();if((!value&&!attachment)||waiting)return;const image=attachment;input.value="";input.style.height="auto";ask(value,image)});input.addEventListener("keydown",event=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();form.requestSubmit()}});input.addEventListener("input",()=>{input.style.height="auto";input.style.height=`${Math.min(input.scrollHeight,115)}px`});
  attach.addEventListener("click",()=>fileInput.click());fileInput.addEventListener("change",()=>selectImage(fileInput.files?.[0]));remove.addEventListener("click",()=>{clearAttachment();input.focus()});newChat.addEventListener("click",resetCurrent);clearAll.addEventListener("click",clearEveryChat);
  go.addEventListener("click",()=>{const selected=ROUTES.find(x=>x.path===route.value);if(selected)navigate(selected.path,selected.label)});up.addEventListener("click",()=>window.scrollBy({top:-innerHeight*SCROLL_AMOUNT,behavior:"smooth"}));down.addEventListener("click",()=>window.scrollBy({top:innerHeight*SCROLL_AMOUNT,behavior:"smooth"}));
  tutorButtons.forEach(button=>button.addEventListener("click",()=>{const prompts={"Teach me":"Tutor Mode: Teach me one concept from the current page. Explain briefly, ask one question, and wait for my response before continuing.","Quiz me":"Tutor Mode: Quiz me on the current page. Ask one question only and wait for my response before evaluating it.","Explain simpler":"Explain the last concept more simply, using shorter words and one concrete example.","Give an example":"Give me one new clear example of the concept we are discussing, then ask whether it makes sense.","Try another question":"Ask another question about the current concept, slightly harder if I answered the previous one correctly."};ask(prompts[button.dataset.tutor])}));
  window.addEventListener("studyspace:ai",event=>{const prompt=String(event.detail?.prompt||"").slice(0,3500);if(!prompt)return;setOpen(true);if(event.detail?.autoSend===false){input.value=prompt;input.focus()}else ask(prompt)});
  window.addEventListener("studyspace:attach-image",event=>{const file=event.detail?.file,prompt=String(event.detail?.prompt||"").slice(0,3000);selectImage(file,prompt)});
  globalThis.StudySpaceAI={open:(prompt="",autoSend=false)=>window.dispatchEvent(new CustomEvent("studyspace:ai",{detail:{prompt,autoSend}}))};
  render();
})();
