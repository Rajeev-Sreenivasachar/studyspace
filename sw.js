const CACHE = "studyspace-shell-v20";
const CORE = [
  "./", "index.html", "offline.html", "styles.css", "app.js?v=16", "manifest.webmanifest",
  "assets/favicon.svg", "assets/chatbot.css?v=1", "assets/chatbot.js?v=2", "assets/studyspace-core.js",
  "assets/data/course-frameworks.js?v=3", "assets/data/middleton-course-library.js?v=2", "assets/data/full-course-content.js?v=4", "assets/course-framework-ui.js?v=4", "assets/course-runtime.js?v=4", "assets/course-library.js?v=4", "styles.css?v=14",
  "assets/data/aphg-unit1.js", "assets/data/question-bank.js", "aphg.html", "aphg-topic.html",
  "aphg-material.html", "aphg-review.html", "aphg-flashcards.html", "aphg-quiz.html", "planner.html", "study.html",
  "assets/aphg-hub.js", "assets/aphg-topic.js", "assets/aphg-material.js", "assets/aphg-flashcards.js",
  "assets/aphg-quiz.js", "assets/planner.js", "assets/study-import.js", "csit-essentials.html",
  "csit-module1.html", "csit-module1-flashcards.html", "csit-module1-quiz.html", "csit-data.js", "subject.html", "course-library.html",
  "course-unit.html", "course-lesson.html", "course-flashcards.html", "course-quiz.html", "course-mistakes.html",
  "biology.html", "biology-topic.html", "biology-flashcards.html", "biology-quiz.html", "biology-mistakes.html",
  "biology-material.html", "biology-session.html", "assets/data/biology-course.js", "assets/data/biology-questions.js",
  "assets/biology-hub.js", "assets/biology-topic.js", "assets/biology-flashcards.js", "assets/biology-quiz.js",
  "assets/biology-mistakes.js", "assets/biology-material.js", "assets/biology-session.js",
  "algebra2.html", "algebra2-section.html", "algebra2-practice.html", "algebra2-flashcards.html",
  "algebra2-mistakes.html", "algebra2-session.html", "assets/data/algebra2-chapter1.js", "assets/algebra2-math.js",
  "assets/algebra2-hub.js", "assets/algebra2-section.js", "assets/algebra2-practice-engine.js",
  "assets/algebra2-practice.js", "assets/algebra2-flashcards.js", "assets/algebra2-mistakes.js", "assets/algebra2-session.js"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then(match => match || caches.match("offline.html"))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});
