# StudySpace

StudySpace is a responsive, installable study workspace built with plain HTML, CSS, and JavaScript. It connects official-framework course maps, source-aware notes, adaptive flashcards, practice quizzes, mastery, planning, imports, focus sessions, and one Gemini-powered tutor.

## Full-year framework and provenance model

`assets/data/course-frameworks.js` preserves the eight original detailed courses. `assets/data/middleton-course-library.js` expands that foundation into 178 courses verified from Middleton High School's latest complete school-specific programming set located (2025-2026). Official public frameworks define what belongs in each course; teacher/class materials can override the classroom order; original StudySpace material supplies copyright-safe teaching and practice. Each source has a stable ID, provenance type, priority, authority, version, scope, and official URL when one exists. Each unit and topic lists its source IDs.

The reusable `assets/course-framework-ui.js` renders expandable course maps and a visible source registry. AP Human Geography, Algebra 2 Honors, and Biology 1 Honors keep their detailed class-specific Unit 1 pages and add the full-year map underneath. AICE Thinking Skills, English 1 Honors, Orchestra 1, CSIT Essentials, and CSIT Foundations use the generic subject hub. CSIT Foundations is intentionally marked as needing its exact class course code or syllabus because the local title does not uniquely identify one Florida CTE framework.

The framework catalog uses current official public sources checked on August 24, 2026: Middleton/HCPS programming documents, College Board course pages, CPALMS/FDOE course and standards records, Cambridge syllabuses, Cisco public course outlines, PLTW public pathway descriptions, and Florida CTE frameworks. It stores links and original summaries only; no paid textbook chapters, past papers, or copyrighted class materials are copied. See `COURSE_LIBRARY_AUDIT.md` for the source, coverage, uncertainty, and completeness audit.

## Main student flows

- `index.html` — My Courses dashboard, universal search, recent progress, founder story, and focus timer
- `course-library.html` — grade-first Middleton catalog grouped by subject, with search, filters, and add/remove dashboard controls
- `aphg.html` — AP Human Geography Unit 1 dashboard, topic map, mastery, class materials, and study sessions
- `aphg-topic.html?t=1.1` — reusable source-aware topic page for Topics 1.1–1.7
- `aphg-material.html?id=teacher-1-1` — reusable class-material viewer and Study This actions
- `aphg-flashcards.html` — topic filters, adaptive modes, persistent Know It/Still Learning state, swipe, and keyboard controls
- `aphg-quiz.html` — 10/20/30-question, topic, weak-topic, and mistake-focused practice with full answer review
- `aphg-review.html` — searchable review of the verified numbered vocabulary entries
- `biology.html` — Biology 1 Honors course hub with Unit 1 mastery, source slots, and a standards-backed full-year map
- `biology-topic.html?s=1.1` — reusable 5E sequence page for Biology Unit 1 Sequences 1.1–1.5
- `biology-flashcards.html`, `biology-quiz.html`, and `biology-mistakes.html` — persistent adaptive practice and mistake review
- `biology-session.html` — a guided session that starts with the weakest measured Biology sequence
- `algebra2.html` — Algebra 2 Honors Chapter 1 hub with six-section mastery, continuation, weak skills, and mistake review
- `algebra2-section.html?s=1.1` — reusable Learn → Visual → Worked Example → Try It → Mastery flow for Sections 1.1–1.6
- `algebra2-practice.html`, `algebra2-flashcards.html`, and `algebra2-mistakes.html` — generated math practice, quick rule review, and misconception recovery
- `algebra2-session.html` — a connected session beginning with the weakest measured Algebra 2 skill
- `planner.html` — assessments, countdowns, editable plans, task completion, and focus-session handoff
- `study.html` — pasted-text/TXT/image import, source-preserving saved sets, scan handoff, and notebook actions
- `csit-essentials.html` and `csit-module1.html` — existing CSIT course content, now connected to Study This and contextual tutor actions

## AP Human Geography source model

The Unit 1 source manifest is `assets/data/aphg-unit1.js`. Every material has a stable ID, source type, priority, topic coverage, availability status, and optional repository path. Source priority is:

1. Teacher material
2. AMSCO material
3. Existing StudySpace notes
4. Clearly labeled StudySpace/AI explanation

The supplied brief contained verified teacher concepts for Topics 1.1 and 1.6, so those are marked as teacher material. No original PowerPoint, PDF, AMSCO file, or vocabulary document was present in the repository or attachments. The supplied vocabulary assignment contains all 46 numbered entries. Their original numbering is preserved, including the intentional repeated `Shape distortion` entry at number 41, while the stable IDs for entries 1–17 remain unchanged so prior progress survives.

Place future authorized originals under `assets/materials/aphg/unit1/` with clear filenames, then update the matching material record's `repositoryPath`, `status`, and `originalAvailable` fields. Reserved teacher slots already exist for Topics 1.2, 1.3, 1.4, 1.5, and 1.7, so those sources can take priority without rebuilding Unit 1.

The practice bank in `assets/data/question-bank.js` contains 46 structured StudySpace practice questions. Each has an ID, topic, type, difficulty, four choices, correct answer, explanation, related terms, and source label. They are practice questions, not claimed teacher test questions.

## Biology architecture and sources

`assets/data/biology-course.js` is the centralized Biology course model. Unit 1 contains five complete learning sequences: Properties of Water; Macromolecules & Enzymes; Cell Theory & Origin of Life; Cell Types, Organelles, & Membrane Transport; and Photosynthesis, Cellular Respiration, & Cell Energetics. Each follows a Pre-Class → Engage → Explore → Explain → Elaborate → Evaluate → Mastery flow and supplies structured targets, visuals, vocabulary, practice, CER work, and AI context.

The known Biology Unit 1 sequence keeps its detailed 5E experience. The complete course runtime now provides original, standards-backed instruction, examples, vocabulary, practice, flashcards, quizzes, and mastery for the remaining Biology framework. Those lessons are not presented as teacher-provided material. The supplied Biology material was a course outline rather than original teacher files, so per-sequence class-source records remain `file-needed` and source-dependent actions stay disabled. Future authorized originals belong under `assets/materials/biology/unit1/<sequence>/`, after which the matching material record can be activated without rebuilding the course pages.

## Complete-course runtime

`assets/data/full-course-content.js` turns every verified framework topic into a structured lesson with learning targets, multi-part instruction, a worked application, misconception coaching, a visual reasoning model, five vocabulary cards, four levels of practice, and four original mastery-check questions. `subject.html`, `course-unit.html`, `course-lesson.html`, `course-flashcards.html`, `course-quiz.html`, and `course-mistakes.html` provide the shared interface for the complete library while preserving the richer class-specific APHG, Biology, Algebra 2, and CSIT Module 1 pages.

`assets/data/biology-questions.js` contains 36 original StudySpace questions across Sequences 1.1–1.5. They are labeled as outline-based StudySpace practice, not teacher questions.

## Algebra 2 Chapter 1 architecture

`assets/data/algebra2-chapter1.js` is the centralized model for Parent Functions and Transformations; Transformations of Linear and Absolute Value Functions; Modeling with Linear Functions; Solving Absolute Value Inequalities; Absolute Value Functions; and Piecewise Functions. It contains 34 measurable skills, 24 quick-review cards, reusable short lessons and worked examples, and 55 original randomized problem templates. Generated items carry a stable skill, difficulty, three progressive hints, explanation, and likely mistake category. They are StudySpace-created practice and are not claimed as teacher or textbook questions.

`assets/algebra2-math.js` renders accessible, responsive SVG function graphs, scatter plots, number lines, and piecewise graphs. The six section pages use the same reusable UI and practice engine, while each section receives an appropriate interactive model: parent-family transformations, reciprocal horizontal scale, line-of-fit balancing, AND/OR number-line regions, vertex form, or piece selection.

The practice engine does not expose the answer immediately. It reveals one hint at a time, checks the student's attempt, explains the likely misconception on an incorrect response, and can generate a similar problem from the same skill. Algebra context is also passed to StudySpace AI so hint, diagnosis, graph explanation, and navigation actions stay aligned with the current chapter, section, and skill.

## Progress and local data

`assets/studyspace-core.js` owns versioned local state in `studyspace-app-v1`. Schema version 3 adds subject-safe Algebra 2 evidence, mistake categories, reviewed status, and later-corrected status. Its migrations preserve prior APHG and Biology flashcard, quiz, planning, notebook, and chatbot history.

Course setup is stored separately in `studyspace-course-setup-v2`. New users begin with no selected courses and complete grade-and-course onboarding; explicit selections from the former `studyspace-my-courses-v1` key migrate forward. Removing a course only changes the dashboard selection and never deletes mastery, mistakes, quiz history, flashcard progress, or other study data.

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

The test validates all 178 Middleton-verified course records, 3,154 generated library lessons, the eight preserved course frameworks, source priority and provenance, AP/AICE counts, the seven APHG units, the 14 Cisco IT Essentials modules, honest ambiguous-course handling, all 46 sequential APHG assignment entries, the original 46-question APHG bank, all five Biology sequences, 36 Biology questions, all six Algebra 2 sections, randomized generator self-checks, 24 Algebra cards, source availability rules, migration hooks, required pages, and local HTML asset links.
