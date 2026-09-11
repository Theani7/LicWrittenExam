# Nepal License Written Prep

[![License: MIT](https://img.shields.io/github/license/Theani7/LicWrittenExam)](LICENSE)
[![Issues](https://img.shields.io/github/issues/Theani7/LicWrittenExam)](https://github.com/Theani7/LicWrittenExam/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Free, offline-first preparation for the **Nepal Department of Transport Management (DoTM) driving license written (likhit) exam** — **Category A & K, syllabus FY 2082/83**.

Practice the official **500-question bank** with learn mode, flashcards, bookmarks and a true 25-question / 30-minute exam simulation. Bilingual (English + नेपाली), dark mode, mobile-first, and 100% client-side — no account, no server, your progress never leaves your browser.

## Features

- **Learn mode** — all 500 official questions across 6 syllabus categories, with instant answer feedback
- **Flashcards** — shuffle, keyboard shortcuts (`←` `→` `Space`) and swipe navigation on mobile
- **Timed mock exam** — official DoTM format: 25 questions sampled by category weightage, 30-minute timer, flag-for-review, question navigator, auto-submit
- **Category drills** — focused practice per section (traffic signs alone carry 24 marks)
- **Bookmarks & missed-question drills** — save tricky questions, re-drill what you got wrong
- **Attempt history** — scores, accuracy, pass rate and per-category breakdowns, stored locally
- **Bilingual** — full English + Nepali (नेपाली) UI and question bank
- **Offline & private** — static JSON dataset, `localStorage` only, works without a backend

## Official exam format

| | |
|---|---|
| Questions | 25 (4 marks each = 100) |
| Pass mark | 60 / 100 (min. 15 correct) |
| Time | 30 minutes (~72s per question) |
| Negative marking | None — always attempt every question |

Category weightage (500Q bank → 25Q paper): Vehicle Operation 130→6 · Vehicle Laws 90→5 · Technical/Mechanical 80→3 · Environment 30→2 · Accident Awareness 60→3 · Traffic Signs 110→6.

## Getting started

**Prerequisites:** Node.js ≥ 18 and npm.

```bash
git clone https://github.com/Theani7/LicWrittenExam.git
cd LicWrittenExam
npm install
npm run dev      # start dev server (Vite)
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc`) + production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the test suite once (Vitest + Testing Library) |

## Project structure

```
├── public/
│   ├── data/               # Decoupled question datasets (questions.json, questions_ne.json)
│   └── signs/              # Traffic-sign diagram images
├── scripts/                # Dataset tooling (extract_*.py, validate_questions.py)
├── src/
│   ├── components/         # learn/ · test/ · bookmarks/ · layout/ · guidelines/ · language/
│   ├── context/            # Theme + Language providers
│   ├── hooks/              # useQuestions, useBookmarks, useExamHistory
│   ├── utils/              # examGenerator, examScorer, categoryColors
│   ├── types/              # Question, Category, ExamResult
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
└── vite.config.ts
```

**Tech:** React 18 · TypeScript · Vite 6 · Tailwind CSS 3 · Vitest + Testing Library · `localStorage` persistence.

## Data

- `public/data/questions.json` — English 500-question bank
- `public/data/questions_ne.json` — Nepali 500-question bank
- `scripts/validate_questions.py` — validates count (500), 4 options per question, valid answer keys, official category distribution (130/90/80/30/60/110) and that referenced sign images exist

## Contributing

Contributions are welcome — question corrections (especially Nepali translations), UI improvements, and new practice features. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first: fork, branch, [Conventional Commits](https://www.conventionalcommits.org/), add/update tests, open a PR.

Found a wrong answer or a typo in a question? Please [open an issue](https://github.com/Theani7/LicWrittenExam/issues) with the question number (e.g. Q12) and the correct official answer.

## Security

See [SECURITY.md](SECURITY.md) for how to report vulnerabilities.

## License

[MIT](LICENSE) © 2026 Theani7.

Question content mirrors the DoTM 500-question curriculum (Ministry of Physical Infrastructure & Transport, Nepal) and is provided for study purposes.
