# StudySpace

A lightweight, responsive student study site built with plain HTML, CSS, and JavaScript.

## Pages

- `index.html` — homepage, subject search, featured set, and focus timer
- `aphg.html` — AP Human Geography subject hub
- `aphg-flashcards.html` — Unit 1 interactive flashcards
- `aphg-review.html` — Unit 1 quick review
- `aphg-quiz.html` — randomized Unit 1 practice quiz
- `subject.html?s=...` — reusable coming-soon subject hubs
- `csit-essentials.html` — IT Essentials 8 course hub
- `csit-module1.html` — searchable Module 1 hardware and safety notes
- `csit-module1-flashcards.html` — 60 Module 1 study cards
- `csit-module1-quiz.html` — randomized 15-question Module 1 practice quiz

The floating StudySpace AI assistant uses a secure serverless route, so its Gemini API key never enters frontend JavaScript.

## StudySpace AI configuration

StudySpace AI calls Google Gemini through the Vercel serverless route at `api/chat.js`. Set `GEMINI_API_KEY` in the Vercel project's environment variables for Production, Preview, and Development, then redeploy. Never place the key in frontend files.

The assistant reads a limited amount of visible page text and accepts PNG, JPEG, or WebP screenshots under 2.5 MB for visual study help. Images are sent only with the student's current request and are not stored in local conversation history.

Chat history is stored separately for AP Human Geography, CSIT Essentials, other subject hubs, and general StudySpace use. The assistant also provides a resource navigator and local commands such as `open the APHG quiz`, `scroll down`, `go to the top`, and `go to the bottom`.

For local serverless development, copy `.env.example` to an untracked `.env.local` and provide your own key. The chatbot uses the stable, cost-efficient `gemini-3.5-flash-lite` model through Google's official `@google/genai` SDK.
