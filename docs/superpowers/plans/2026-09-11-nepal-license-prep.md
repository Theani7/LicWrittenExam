# Nepal Driving License Exam Preparation Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimalist, responsive React + Vite web application for the Nepal Category A/K driving license written exam (2082/2083 syllabus) featuring decoupled JSON questions, Learn Mode (study & flashcards), and Test Mode (official 25-question/30-min simulation with DoTM category weightage and category practice).

**Architecture:** A standalone React single-page app configured with Tailwind CSS and Lucide React. Questions and sign diagrams are extracted from the official PDF into `public/data/questions.json` and `public/signs/`, decoupled from the code. Local state handles exam simulation, bookmarks, and score tracking with `localStorage` persistence.

**Tech Stack:** React 18 / 19, TypeScript, Vite, Tailwind CSS, Lucide React, canvas-confetti, Vitest, Python (PyMuPDF / pdfplumber for data extraction).

## Global Constraints
- Target question pool: 500 official questions across 6 DoTM categories.
- Official exam simulation: Exactly 25 questions, 30-minute timer, 4 marks each (100 total), 60 marks pass threshold.
- Exam category distribution: 6 Vehicle Operation + 5 Vehicle Laws + 3 Technical/Mechanical + 2 Environmental Pollution + 3 Accident Awareness + 6 Traffic Signs.
- Clean minimalist aesthetic: Monochrome slate/zinc palette, subtle borders, high-readability typography, light/dark mode support.
- Zero hardcoding: Questions must load from human-editable JSON in `public/data/questions.json`.

---

### Task 1: PDF Question Bank & Sign Asset Extraction Pipeline

**Files:**
- Create: `scripts/extract_questions.py`
- Create: `scripts/validate_questions.py`
- Output: `public/data/questions.json`
- Output: `public/signs/*.png`

**Interfaces:**
- Consumes: `/Users/theani7/Downloads/Category AK 2082-83 English (1)_rhjjnoh.pdf`
- Produces: `public/data/questions.json` containing `{ metadata, categories, questions }` where each question has `{ id, categoryId, question, image, options: [{ key, text }], correctAnswer }`.

- [ ] **Step 1: Write the extraction script**
  Create `scripts/extract_questions.py` to parse all 59 pages using `pdfplumber` and `pymupdf`, extracting question numbers 1-500, question text, options (A, B, C, D), checkmark column ('A', 'B', 'C', or 'D'), and saving visual traffic sign images to `public/signs/`.

- [ ] **Step 2: Run the extraction script**
  Run: `/tmp/pdf_venv/bin/python3 scripts/extract_questions.py`
  Expected: 500 questions extracted to `public/data/questions.json`, traffic sign images written to `public/signs/`.

- [ ] **Step 3: Write and run the validation script**
  Create `scripts/validate_questions.py` checking:
  1. Total questions count == 500.
  2. Each question has non-empty `question` string.
  3. Each question has exactly 4 options (`A`, `B`, `C`, `D`) with non-empty text.
  4. Each question's `correctAnswer` is in `['A', 'B', 'C', 'D']`.
  5. Category distribution matches official DoTM counts (130, 90, 80, 30, 60, 110).
  6. All image paths referenced actually exist on disk.
  Run: `/tmp/pdf_venv/bin/python3 scripts/validate_questions.py`
  Expected: PASS with 500 valid questions verified.

- [ ] **Step 4: Commit extracted dataset and scripts**
  ```bash
  git add scripts/ public/data/questions.json public/signs/
  git commit -m "feat(data): extract and validate 500 official questions from PDF"
  ```

---

### Task 2: Project Setup (Vite + React + TypeScript + Tailwind CSS)

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Create: `src/types/index.ts`
- Create: `src/hooks/useQuestions.ts`

**Interfaces:**
- Produces: Type definitions for `Question`, `Option`, `Category`, `ExamConfig`, `UserAnswer`, `ExamResult`.
- Produces: `useQuestions()` hook returning `{ questions, categories, metadata, loading, error }`.

- [ ] **Step 1: Initialize Vite React TypeScript project and dependencies**
  Install `lucide-react`, `canvas-confetti`, `@types/canvas-confetti`, `tailwindcss`, `postcss`, `autoprefixer`.
  Configure Tailwind CSS with dark mode class support and clean typography.

- [ ] **Step 2: Create TypeScript interfaces in `src/types/index.ts`**
  Define `Category`, `OptionKey`, `QuestionOption`, `Question`, `ExamConfig`, `UserAnswer`, `ExamResult`, `ExamCategoryScore`.

- [ ] **Step 3: Implement `src/hooks/useQuestions.ts`**
  Fetch `questions.json` from `/data/questions.json` (with fallback to bundled static import).

- [ ] **Step 4: Verify build and dev setup**
  Run: `npm run build`
  Expected: Build succeeds without TypeScript or bundling errors.

- [ ] **Step 5: Commit project scaffolding**
  ```bash
  git add package.json package-lock.json tsconfig* vite.config.ts tailwind.config.js postcss.config.js index.html src/
  git commit -m "chore: scaffold React Vite app with TypeScript and Tailwind CSS"
  ```

---

### Task 3: Theme & Local Storage State Management

**Files:**
- Create: `src/context/ThemeContext.tsx`
- Create: `src/hooks/useBookmarks.ts`
- Create: `src/hooks/useExamHistory.ts`
- Test: `src/test/useBookmarks.test.ts`

**Interfaces:**
- Produces: `ThemeProvider` and `useTheme()` for light/dark toggle (`light` / `dark`).
- Produces: `useBookmarks()` providing `{ bookmarks, toggleBookmark, isBookmarked, clearBookmarks }`.
- Produces: `useExamHistory()` providing `{ history, saveExamResult, clearHistory }`.

- [ ] **Step 1: Write tests for `useBookmarks` and `useExamHistory`**
  Test adding, toggling, checking, and persisting to `localStorage`.

- [ ] **Step 2: Implement `src/context/ThemeContext.tsx`**
  Handle system preference default, user toggle, and class sync on `document.documentElement`.

- [ ] **Step 3: Implement `useBookmarks.ts` and `useExamHistory.ts`**
  Safely read and write JSON in `localStorage` with fallback for storage limits or missing window object.

- [ ] **Step 4: Run tests**
  Run: `npx vitest run src/test/`
  Expected: All tests PASS.

- [ ] **Step 5: Commit theme and state hooks**
  ```bash
  git add src/context/ src/hooks/ src/test/
  git commit -m "feat(state): add theme provider and persistence hooks for bookmarks and history"
  ```

---

### Task 4: Learn Mode (Study, Filter, Search, Flashcard & List Views)

**Files:**
- Create: `src/components/learn/LearnView.tsx`
- Create: `src/components/learn/QuestionCard.tsx`
- Create: `src/components/learn/FlashcardView.tsx`
- Create: `src/components/learn/CategoryPills.tsx`
- Create: `src/components/learn/SearchBar.tsx`

**Interfaces:**
- Consumes: `Question[]`, `Category[]`, `useBookmarks()`
- Produces: Interactive study UI allowing users to filter by 6 categories, search by keyword, filter bookmarked questions, toggle between List and Flashcard view, and click options to reveal correct/incorrect answers immediately.

- [ ] **Step 1: Implement `CategoryPills.tsx` & `SearchBar.tsx`**
  Category buttons displaying name, question count, and active highlight. Search bar with instant debounced text search.

- [ ] **Step 2: Implement `QuestionCard.tsx`**
  Displays question number, category badge, bookmark toggle icon, image (if present), 4 interactive option buttons (A, B, C, D), and "Show Answer" toggle button. Clicking an option highlights green if correct, red if incorrect.

- [ ] **Step 3: Implement `FlashcardView.tsx`**
  Single-question flashcard mode with "Previous", "Next", "Reveal Answer", keyboard arrow navigation (Left/Right to change question, Space to reveal).

- [ ] **Step 4: Implement `LearnView.tsx` combining all components**
  Toggle between List and Flashcard views, filter bar with "All", "Bookmarked", "Traffic Signs Only", and category selection.

- [ ] **Step 5: Verify in browser and build**
  Run: `npm run build`
  Expected: Zero build errors.

- [ ] **Step 6: Commit Learn Mode**
  ```bash
  git add src/components/learn/
  git commit -m "feat(learn): implement study mode with category filtering, search, and flashcards"
  ```

---

### Task 5: Test Mode — Exam Generator & Simulation Engine

**Files:**
- Create: `src/utils/examGenerator.ts`
- Create: `src/components/test/TestHome.tsx`
- Create: `src/components/test/ExamEngine.tsx`
- Create: `src/components/test/QuestionNavigator.tsx`
- Test: `src/test/examGenerator.test.ts`

**Interfaces:**
- Produces: `generateOfficialExam(questions: Question[]): Question[]` (returns exactly 25 questions: 6 from cat 1, 5 from cat 2, 3 from cat 3, 2 from cat 4, 3 from cat 5, 6 from cat 6).
- Produces: `generateCategoryTest(questions: Question[], categoryId: number, count?: number): Question[]`.
- Produces: `ExamEngine` running a 30:00 timer, storing selected answers, supporting "Mark for Review", jump navigation, and submit dialog.

- [ ] **Step 1: Write test for `examGenerator`**
  Verify generated official exam contains exactly 25 questions with the exact required distribution across all 6 categories.

- [ ] **Step 2: Implement `src/utils/examGenerator.ts`**
  Deterministic random sampling per category meeting the official DoTM specification.

- [ ] **Step 3: Implement `TestHome.tsx`**
  Presents two test choices:
  1. "Start Official Exam Simulation" (25 questions, 30 minutes, 60/100 pass mark).
  2. "Category Practice Test" (Pick any of the 6 categories for targeted drill).

- [ ] **Step 4: Implement `ExamEngine.tsx` & `QuestionNavigator.tsx`**
  - Top bar with remaining time `MM:SS` (red when < 5 minutes), progress bar, and "Submit Exam" button.
  - Question area with option selection and "Mark for Review" flag.
  - Responsive Navigator Drawer/Grid showing numbered squares: Unanswered (slate), Answered (blue), Marked for Review (amber).
  - Submit confirmation dialog displaying count of answered vs unanswered questions.

- [ ] **Step 5: Run tests and verify build**
  Run: `npx vitest run src/test/examGenerator.test.ts && npm run build`
  Expected: PASS and clean build.

- [ ] **Step 6: Commit Test Mode engine**
  ```bash
  git add src/utils/ src/components/test/ src/test/
  git commit -m "feat(test): implement official 25-question exam generator and simulation engine"
  ```

---

### Task 6: Exam Results, Analytics & Answer Review

**Files:**
- Create: `src/utils/examScorer.ts`
- Create: `src/components/test/ExamResultView.tsx`
- Create: `src/components/test/QuestionReviewItem.tsx`
- Test: `src/test/examScorer.test.ts`

**Interfaces:**
- Produces: `calculateExamResult(questions, userAnswers, durationSeconds): ExamResult`
- Produces: Scorecard with Pass/Fail status, marks (out of 100), category-wise score breakdown, and detailed review filterable by "All Questions", "Incorrect Only", "Correct Only".

- [ ] **Step 1: Write test for `examScorer`**
  Test marks calculation (4 marks per correct answer), pass/fail threshold (>= 60 marks = PASS), and category breakdown.

- [ ] **Step 2: Implement `src/utils/examScorer.ts`**
  Calculate total score, percentage, passed boolean, time taken, and category-level stats.

- [ ] **Step 3: Implement `ExamResultView.tsx`**
  - Pass / Fail status banner with percentage and confetti explosion on passing.
  - Stat grid: Score (e.g. 84/100), Correct (21/25), Incorrect (4/25), Time Taken (e.g. 14m 22s).
  - Category performance table with progress bars.
  - Action buttons: "Retake Official Exam", "Practice Incorrect Questions", "Back to Learn Mode".
  - Question-by-question review showing user choice vs correct answer with explanations/sign images.

- [ ] **Step 4: Run tests and verify build**
  Run: `npx vitest run src/test/examScorer.test.ts && npm run build`
  Expected: PASS and clean build.

- [ ] **Step 5: Commit Exam Results and Review**
  ```bash
  git add src/utils/examScorer.ts src/components/test/ExamResultView.tsx src/components/test/QuestionReviewItem.tsx src/test/
  git commit -m "feat(test): add scorecard, category analytics, and question review with confetti"
  ```

---

### Task 7: Bookmarks View, Guidelines Modal & Navigation Shell

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/bookmarks/BookmarksView.tsx`
- Create: `src/components/guidelines/GuidelinesModal.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: All views (`LearnView`, `TestView`, `BookmarksView`, `GuidelinesModal`).
- Produces: Complete app navigation with active tab indicators, quick stats pill, dark mode toggle, and guidelines dialog.

- [ ] **Step 1: Implement `GuidelinesModal.tsx`**
  Detailed modal outlining official Nepal DoTM Category A/K rules, marks weightage per category, pass mark criteria (60/100), and test day tips.

- [ ] **Step 2: Implement `BookmarksView.tsx`**
  List of all bookmarked questions with count, search, option to practice bookmarked questions, and clear all.

- [ ] **Step 3: Implement `Navbar.tsx` and `Footer.tsx`**
  Minimalist top bar with tabs: Learn, Test, Bookmarks; DoTM Guidelines button; Theme toggle; and responsive mobile menu.

- [ ] **Step 4: Wire all components into `src/App.tsx`**
  Manage active tab state (`learn`, `test`, `bookmarks`), load questions via `useQuestions()`, and handle active test state without losing unsaved progress.

- [ ] **Step 5: Commit navigation shell and bookmarks**
  ```bash
  git add src/components/layout/ src/components/bookmarks/ src/components/guidelines/ src/App.tsx
  git commit -m "feat(ui): integrate top navigation, bookmarks tab, and official guidelines modal"
  ```

---

### Task 8: Verification, Responsive Polish & Final Build

**Files:**
- Test: All tests in `src/test/`
- Verify: `npm run build`
- Verify: `npm run preview` / browser check

- [ ] **Step 1: Run complete test suite**
  Run: `npx vitest run`
  Expected: All unit tests pass.

- [ ] **Step 2: Verify production build output**
  Run: `npm run build`
  Expected: `dist/` directory generated with optimized JS, CSS, `data/questions.json`, and sign images.

- [ ] **Step 3: Manual & visual verification**
  Run Vite preview or dev server, verify:
  - All 500 questions are browseable.
  - Sign images render crisply.
  - Learn mode answer reveal and search work.
  - Test mode 25-question generation and 30-min timer work properly.
  - Exam submission displays scorecard and category breakdown.
  - Bookmarks persist after page refresh.
  - Dark mode and light mode both look crisp and minimalist.

- [ ] **Step 4: Final commit**
  ```bash
  git add .
  git commit -m "chore: complete nepal license written prep web app implementation"
  ```
