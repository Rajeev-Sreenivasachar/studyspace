(()=>{
  "use strict";
  const STORAGE_KEY="studyspace-ai-history-v1",MAX_STORED=12,CONTEXT_LIMIT=6000;
  let history=[],waiting=false,lastRequest="",attachment=null;

  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
    if(Array.isArray(saved))history=saved.filter(x=>["user","assistant"].includes(x?.role)&&typeof x?.content==="string").slice(-MAX_STORED);
  }catch{localStorage.removeItem(STORAGE_KEY)}

  document.body.insertAdjacentHTML("beforeend",`<button class="ssai-toggle" id="ssaiToggle" aria-label="Open StudySpace AI" aria-expanded="false" aria-controls="ssaiPanel">✦</button><aside class="ssai-panel" id="ssaiPanel" role="dialog" aria-modal="false" aria-labelledby="ssaiTitle"><header class="ssai-head"><div class="ssai-title"><span class="ssai-mark" aria-hidden="true">✦</span><div><strong id="ssaiTitle">StudySpace AI</strong><span>Powered by Google Gemini</span></div></div><div class="ssai-head-actions"><button class="ssai-clear" id="ssaiClear" type="button">Clear chat</button><button class="ssai-close" id="ssaiClose" type="button" aria-label="Close StudySpace AI">×</button></div></header><div class="ssai-messages" id="ssaiMessages" aria-live="polite" aria-label="Conversation"></div><form class="ssai-form" id="ssaiForm"><div class="ssai-attachment" id="ssaiAttachment" hidden><img id="ssaiPreview" alt="Screenshot preview"><span id="ssaiFileName"></span><button type="button" id="ssaiRemove" aria-label="Remove attached screenshot">×</button></div><div class="ssai-input-row"><input class="ssai-sr" id="ssaiFile" type="file" accept="image/png,image/jpeg,image/webp"><button class="ssai-attach" id="ssaiAttach" type="button" aria-label="Attach a screenshot">📎</button><label class="ssai-sr" for="ssaiInput">Message StudySpace AI</label><textarea class="ssai-input" id="ssaiInput" rows="1" maxlength="1500" placeholder="Ask about this lesson or a screenshot…"></textarea><button class="ssai-send" id="ssaiSend" type="submit">Send</button></div><p class="ssai-note">Attach PNG, JPEG, or WebP under 2.5 MB • Enter to send</p></form></aside>`);

  const toggle=document.querySelector("#ssaiToggle"),panel=document.querySelector("#ssaiPanel"),close=document.querySelector("#ssaiClose"),clear=document.querySelector("#ssaiClear"),messages=document.querySelector("#ssaiMessages"),form=document.querySelector("#ssaiForm"),input=document.querySelector("#ssaiInput"),send=document.querySelector("#ssaiSend"),fileInput=document.querySelector("#ssaiFile"),attach=document.querySelector("#ssaiAttach"),attachmentBox=document.querySelector("#ssaiAttachment"),preview=document.querySelector("#ssaiPreview"),fileName=document.querySelector("#ssaiFileName"),remove=document.querySelector("#ssaiRemove");

  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(history.slice(-MAX_STORED)))}catch{}}
  function scroll(){messages.scrollTop=messages.scrollHeight}
  function bubble(content,role,store=false){
    const el=document.createElement("div");el.className=`ssai-message ${role}`;el.textContent=content;messages.appendChild(el);
    if(store){history.push({role:role==="ai"?"assistant":"user",content});history=history.slice(-MAX_STORED);save()}
    scroll();return el;
  }
  function render(){
    messages.replaceChildren();
    if(!history.length)bubble("Hi! I’m StudySpace AI. Ask me to explain this page, compare concepts, make a memory trick, or quiz you.","ai");
    else history.forEach(x=>bubble(x.content,x.role==="assistant"?"ai":"user"));
    scroll();
  }
  function setOpen(open){panel.classList.toggle("open",open);toggle.setAttribute("aria-expanded",String(open));if(open){input.focus();scroll()}else toggle.focus()}
  function setWaiting(value){waiting=value;send.disabled=value;input.disabled=value;clear.disabled=value;attach.disabled=value;remove.disabled=value}
  function clearAttachment(){attachment=null;fileInput.value="";preview.removeAttribute("src");fileName.textContent="";attachmentBox.hidden=true}
  function selectImage(file){
    if(!file)return;
    if(!["image/png","image/jpeg","image/webp"].includes(file.type)){bubble("Use a PNG, JPEG, or WebP screenshot.","ai error");return clearAttachment()}
    if(file.size>2_500_000){bubble("That screenshot is too large. Choose one under 2.5 MB.","ai error");return clearAttachment()}
    const reader=new FileReader();
    reader.onload=()=>{const result=String(reader.result||""),comma=result.indexOf(",");if(comma<0)return clearAttachment();attachment={mimeType:file.type,data:result.slice(comma+1)};preview.src=result;fileName.textContent=file.name;attachmentBox.hidden=false;input.focus()};
    reader.onerror=()=>{bubble("I couldn't read that screenshot. Please try another image.","ai error");clearAttachment()};reader.readAsDataURL(file);
  }
  function typing(){const el=document.createElement("div");el.className="ssai-message ai ssai-typing";el.setAttribute("aria-label","StudySpace AI is typing");el.innerHTML="<i></i><i></i><i></i>";messages.appendChild(el);scroll();return el}
  function pageContext(){
    const main=document.querySelector("main");if(!main)return "";
    const clone=main.cloneNode(true);clone.querySelectorAll("script,style,button,input,textarea,select,.ssai-panel").forEach(el=>el.remove());
    return (clone.innerText||clone.textContent||"").replace(/\s+/g," ").trim().slice(0,CONTEXT_LIMIT);
  }
  async function ask(message,image){
    const prompt=message||"Please help me understand this screenshot.";
    const fingerprint=`${location.pathname}\n${prompt}\n${image?.data?.slice(0,24)||""}`;if(waiting||fingerprint===lastRequest)return;lastRequest=fingerprint;setWaiting(true);bubble(`${prompt}${image?"\n📷 Screenshot attached":""}`,"user",true);clearAttachment();const loading=typing();
    try{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
      const response=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:prompt,image,history:history.slice(0,-1).slice(-10),pageTitle:document.title,pagePath:location.pathname,pageContext:pageContext()}),signal:controller.signal});
      clearTimeout(timer);let data={};try{data=await response.json()}catch{}
      loading.remove();
      if(!response.ok)throw new Error(data.error||"StudySpace AI is unavailable right now.");
      bubble(data.reply||"I couldn't create a response. Please try again.","ai",true);
    }catch(error){
      loading.remove();
      const message=error?.name==="AbortError"?"That took too long. Please try a shorter question.":error?.message||"StudySpace AI is unavailable right now. Please try again later.";
      bubble(message,"ai error");lastRequest="";
    }finally{lastRequest="";setWaiting(false);input.focus()}
  }

  toggle.addEventListener("click",()=>setOpen(!panel.classList.contains("open")));close.addEventListener("click",()=>setOpen(false));
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&panel.classList.contains("open"))setOpen(false)});
  form.addEventListener("submit",event=>{event.preventDefault();const value=input.value.trim();if((!value&&!attachment)||waiting)return;const image=attachment;input.value="";input.style.height="auto";ask(value,image)});
  input.addEventListener("keydown",event=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();form.requestSubmit()}});
  input.addEventListener("input",()=>{input.style.height="auto";input.style.height=`${Math.min(input.scrollHeight,115)}px`});
  attach.addEventListener("click",()=>fileInput.click());fileInput.addEventListener("change",()=>selectImage(fileInput.files?.[0]));remove.addEventListener("click",()=>{clearAttachment();input.focus()});
  clear.addEventListener("click",()=>{if(waiting)return;history=[];lastRequest="";clearAttachment();localStorage.removeItem(STORAGE_KEY);render();input.focus()});
  render();
})();
