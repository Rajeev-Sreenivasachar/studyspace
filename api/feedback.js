const WINDOW_MS = 60_000;
const REQUESTS_PER_WINDOW = 5;
const buckets = globalThis.__studySpaceFeedbackBuckets || (globalThis.__studySpaceFeedbackBuckets = new Map());
const TYPES = new Set(["Missing unit/topic", "Add detail", "Incorrect info", "Practice/quiz problem", "Upcoming test", "Class content update", "Website bug", "Feature idea", "Other"]);

function respond(res, status, payload) { res.status(status).setHeader("Content-Type", "application/json; charset=utf-8"); res.setHeader("Cache-Control", "no-store"); return res.json(payload); }
function clean(value, max) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function html(value) { return String(value).replace(/[&<>\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character])); }
function clientIp(req) { const value = req.headers["x-forwarded-for"]; return (Array.isArray(value) ? value[0] : value?.split(",")[0])?.trim() || req.socket?.remoteAddress || "unknown"; }
function allowed(req) { const now = Date.now(), key = clientIp(req), current = buckets.get(key); if (!current || now - current.started >= WINDOW_MS) { buckets.set(key, { started: now, count: 1 }); return true; } current.count += 1; return current.count <= REQUESTS_PER_WINDOW; }

export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return respond(res, 405, { error: "Method not allowed." }); }
  if (!allowed(req)) return respond(res, 429, { error: "Too many reports. Please wait a minute and try again." });
  let body = req.body; if (typeof body === "string") try { body = JSON.parse(body); } catch { return respond(res, 400, { error: "Invalid request." }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return respond(res, 400, { error: "Invalid request." });
  if (clean(body.website, 200)) return respond(res, 200, { ok: true });
  const type = clean(body.type, 80), message = clean(body.message, 4000), email = clean(body.email, 200);
  if (!TYPES.has(type)) return respond(res, 400, { error: "Choose a valid feedback type." });
  if (message.length < 10) return respond(res, 400, { error: "Please include at least 10 characters of detail." });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return respond(res, 400, { error: "Enter a valid contact email or leave it blank." });
  const course = clean(body.course, 120), topic = clean(body.topic, 120), testDate = clean(body.testDate, 20), testType = clean(body.testType, 60), testCoverage = clean(body.testCoverage, 220), context = clean(body.context, 1200);
  if (type === "Upcoming test" && (!/^\d{4}-\d{2}-\d{2}$/.test(testDate) || !testCoverage)) return respond(res, 400, { error: "Add the test date and coverage." });
  const recipients = clean(process.env.FEEDBACK_EMAILS, 500).split(",").map(item => item.trim()).filter(Boolean);
  if (!process.env.RESEND_API_KEY || !process.env.FEEDBACK_FROM_EMAIL || recipients.length < 2) return respond(res, 503, { error: "Feedback delivery is not configured yet." });
  const fields = [["Type", type], ["Course", course || "General"], ["Unit/topic", topic || "Not provided"], ["Test date", testDate], ["Test type", testType], ["Test coverage", testCoverage], ["Contact", email || "Not provided"], ["Context", context || "Direct feedback"]].filter(([, value]) => value);
  const emailHtml = `<h2>StudySpace feedback</h2>${fields.map(([label, value]) => `<p><strong>${html(label)}:</strong> ${html(value)}</p>`).join("")}<hr><p style="white-space:pre-wrap">${html(message)}</p>`;
  try {
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.FEEDBACK_FROM_EMAIL, to: recipients, reply_to: email || undefined, subject: `[StudySpace] ${type}${course ? ` · ${course}` : ""}`, html: emailHtml }) });
    if (!response.ok) { const detail = await response.text(); console.error("Feedback delivery failed", response.status, detail.slice(0, 180)); return respond(res, 502, { error: "Feedback delivery is temporarily unavailable." }); }
    return respond(res, 200, { ok: true });
  } catch (error) { console.error("Feedback delivery failed", error?.message?.slice(0, 180)); return respond(res, 502, { error: "Feedback delivery is temporarily unavailable." }); }
}
