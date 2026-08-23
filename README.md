# StudySpace

StudySpace is a responsive, installable study workspace built with plain HTML, CSS, and JavaScript. It connects source-aware notes, adaptive flashcards, practice quizzes, mastery, planning, imports, focus sessions, and one Gemini-powered tutor.

## Main student flows

- `index.html` — smart home dashboard, universal search, subjects, recent progress, founder story, and focus timer
- `aphg.html` — AP Human Geography Unit 1 dashboard, topic map, mastery, class materials, and study sessions
- `aphg-topic.html?t=1.1` — reusable source-aware topic page for Topics 1.1–1.7
- `aphg-material.html?id=teacher-1-1` — reusable class-material viewer and Study This actions
- `aphg-flashcards.html` — topic filters, adaptive modes, persistent Know It/Still Learning state, swipe, and keyboard controls
- `aphg-quiz.html` — 10/20/30-question, topic, weak-topic, and mistake-focused practice with full answer review
- `aphg-review.html` — searchable review of the verified numbered vocabulary entries
- `planner.html` — assessments, countdowns, editable plans, task completion, and focus-session handoff
- `study.html` — pasted-text/TXT/image import, source-preserving saved sets, scan handoff, and notebook actions
- `csit-essentials.html` and `csit-module1.html` — existing CSIT course content, now connected to Study This and contextual tutor actions

## AP Human Geography source model

The Unit 1 source manifest is `assets/data/aphg-unit1.js`. Every material has a stable ID, source type, priority, topic coverage, availability status, and optional repository path. Source priority is:

1. Teacher material
2. AMSCO material
3. Existing StudySpace notes
4. Clearly labeled StudySpace/AI explanation

The supplied brief contained verified teacher concepts for Topics 1.1 and 1.6, so those are marked as teacher material. No original PowerPoint, PDF, AMSCO file, or vocabulary document was present in the repository or attachments. The earlier supplied vocabulary brief contained authoritative numbered entries 1–17; those are preserved exactly as the available assignment. StudySpace does not invent entries 18–46 or claim that missing files were processed.

Place future authorized originals under `assets/materials/aphg/unit1/` with clear filenames, then update the matching material record's `repositoryPath`, `status`, and `originalAvailable` fields. Reserved teacher slots already exist for Topics 1.2, 1.3, 1.4, 1.5, and 1.7, so those sources can take priority without rebuilding Unit 1.

The practice bank in `assets/data/question-bank.js` contains 46 structured StudySpace practice questions. Each has an ID, topic, type, difficulty, four choices, correct answer, explanation, related terms, and source label. They are practice questions, not claimed teacher test questions.

## Progress and local data

`assets/studyspace-core.js` owns versioned local state in `studyspace-app-v1`. It migrates prior APHG flashcard and quiz history without clearing existing chatbot histories.

Topic mastery needs at least three pieces of evidence. When enough exists, quiz performance contributes 70% and flashcard mastery contributes 30%; available components are normalized when only one evidence type exists. Scores are labeled Strong at 80%+, Developing at 60–79%, and Weak below 60%. Until then, the interface says `Not enough data yet`.

Assessments, generated plan tasks, task completion, quiz attempts, question performance, flashcard progress, imported study sets, notes, and completed focus sessions are stored on the current device. There is no user account or cross-device sync yet.

## StudySpace AI

The existing Gemini backend remains the single AI route at `api/chat.js`; the API key never enters frontend JavaScript. The tutor can use visible page text or the explicitly selected source, maintain separate local chats by subject, interpret commands such as `quiz me on Topic 1.6` and `start a 15-minute focus session`, navigate resources, scroll the page, and accept PNG/JPEG/WebP screenshots under 2.5 MB.

Set `GEMINI_API_KEY` in the Vercel project's Production, Preview, and Development environments. For local serverless development, copy `.env.example` to an untracked `.env.local`. The backend currently uses `gemini-3.5-flash-lite` through Google's official `@google/genai` SDK.

## Offline and installation

`manifest.webmanifest` and `sw.js` provide an installable app shell. Core study pages and static data are cached; navigation uses the network first and falls back to cache or `offline.html`. The `/api` route is never cached, and the offline page explains that live AI requires an internet connection.

## Development and verification

Serve the repository over HTTP rather than opening HTML files directly so the service worker can register. Then run:

```sh
npm test
```

The test validates the seven-topic model, the 17 verified sequential vocabulary entries, the 46-question bank, source availability rules, required pages, and local HTML asset links.
