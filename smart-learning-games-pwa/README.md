# Smart Learning Games

A local-first Next.js Progressive Web App for students in Classes 1–7. It includes five playable learning modes, translated English/Hindi/Marathi/Urdu navigation and question banks, child profiles, progress, and local teacher tools.

## Run it

- Install dependencies with `npm install`.
- Start the development server with `npm run dev`.
- Build for production with `npm run build`.

The core learning app does not require a paid API, account, or database credentials. Profiles, scores, settings, custom questions, class groups, and assignments are kept in this browser's `localStorage`. The teacher area is explicitly a local device workspace, not online authentication or cross-device classroom delivery. Clearing browser site data also removes local progress.

## Games and content

The shared quiz engine supports a no-timer practice round by default, an optional 60-second timer, answer explanations, hints, first-try bonuses, and completion summaries. Math includes arithmetic/number questions and spoken 2–20 tables; Brain Battle includes question-based patterns and a playable memory-match game. Browser speech is optional and only offered when a voice for the selected language is available. Students can always read the bundled questions. Question data lives in `src/lib/learning-content.ts`; translations live in `src/lib/translations.ts` and topic labels in `src/lib/topic-labels.ts`. The teacher studio validates custom MCQs and offers CSV import/export and progress CSV/print reports.

CSV import headers:

```text
mode,language,classLevel,topic,question,option1,option2,option3,option4,answer,explanation,difficulty
```

`mode` is `math`, `words`, `science`, `brain`, or `india`; `language` is `en`, `hi`, `mr`, or `ur`; `classLevel` is 1–7; `answer` is the correct option number 1–4. Quotes and commas in cells are supported. Invalid rows are ignored and a file with no valid rows is rejected. Custom questions are shown only for their selected language and class level.

## Offline and PWA notes

The manifest and service worker cache the app shell and same-origin application assets. Load the app once while online before using it offline. Progress and bundled question banks work locally; browser speech needs a compatible installed voice. No online account, synchronization, or server-side teacher authorization is configured. The service worker does not cache API writes.

## Privacy and development

No advertising, third-party analytics, student email, or identifying student information is collected. Use nicknames only. `validateQuestionBank()` checks bundled question IDs, options, translations, and explanations. This project intentionally uses browser-local persistence rather than pretending that a classroom backend is configured.
