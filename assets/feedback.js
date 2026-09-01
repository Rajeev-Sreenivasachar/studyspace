(function () {
  "use strict";
  const form = document.querySelector("#feedbackForm");
  if (!form) return;
  const esc = value => globalThis.StudySpace?.escapeHtml(value) || String(value ?? "").replace(/[&<>\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  const courseSelect = document.querySelector("#feedbackCourse");
  const courses = globalThis.MIDDLETON_COURSE_LIBRARY?.list?.() || globalThis.STUDYSPACE_COURSES?.list?.() || [];
  courseSelect.insertAdjacentHTML("beforeend", courses.map(course => `<option value="${esc(course.id)}">${esc(course.title)}</option>`).join(""));
  const params = new URLSearchParams(location.search);
  if (params.get("course") && [...courseSelect.options].some(option => option.value === params.get("course"))) courseSelect.value = params.get("course");
  document.querySelector("#feedbackTopic").value = params.get("topic") || "";
  document.querySelector("#feedbackContext").value = JSON.stringify({ sourcePage: params.get("from") || document.referrer || "direct", path: params.get("path") || "", pageTitle: params.get("title") || "", questionId: params.get("question") || "" }).slice(0, 1200);
  const testFields = document.querySelector("#testFields");
  document.querySelector("#feedbackType").onchange = event => { const shown = event.target.value === "Upcoming test"; testFields.hidden = !shown; document.querySelector("#testDate").required = shown; document.querySelector("#testCoverage").required = shown; };
  form.onsubmit = async event => {
    event.preventDefault();
    const status = document.querySelector("#feedbackStatus"), submit = document.querySelector("#feedbackSubmit");
    status.textContent = "Sending…"; submit.disabled = true;
    const payload = { type: document.querySelector("#feedbackType").value, course: courseSelect.value, topic: document.querySelector("#feedbackTopic").value, message: document.querySelector("#feedbackMessage").value, email: document.querySelector("#feedbackEmail").value, website: document.querySelector("#feedbackWebsite").value, testDate: document.querySelector("#testDate").value, testType: document.querySelector("#testType").value, testCoverage: document.querySelector("#testCoverage").value, context: document.querySelector("#feedbackContext").value };
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Feedback could not be sent.");
      form.reset(); testFields.hidden = true; status.textContent = "Thank you. Your feedback was sent to the StudySpace team.";
    } catch (error) { status.textContent = error.message || "Feedback could not be sent. Please try again."; }
    finally { submit.disabled = false; }
  };
})();
