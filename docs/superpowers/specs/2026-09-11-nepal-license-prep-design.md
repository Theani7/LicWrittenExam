# Nepal Driving License Written Exam Preparation Web App (Category A / K 2082/2083)

## 1. Overview
A minimalist, high-performance web application designed for candidates preparing for the Nepal Department of Transport Management (DoTM) Category 'A' (Motorcycle) and Category 'K' (Scooter/Moped) written driving license examination (Fiscal Year 2082/2083).

The app extracts all 500 questions, multiple-choice options, answers, and traffic sign diagrams from the official government syllabus PDF into decoupled, human-editable JSON and media assets. It provides two core experiences:
1. **Learn Mode**: Comprehensive study and practice with category filters, search, flashcard/list toggles, instant answer reveal, and bookmarking.
2. **Test Mode**: An official timed simulation (25 questions, 30 minutes, 60/100 pass mark, weighted across 6 official categories) and targeted category practice tests.

---

## 2. Architecture & Data Model

### 2.1 Decoupled Question Bank (`public/data/questions.json`)
The questions are strictly decoupled from the UI code, enabling easy additions, edits, or removals in JSON format:

```json
{
  "metadata": {
    "title": "Category A & K Driving License Written Exam Question Bank",
    "version": "Fiscal Year 2082/2083",
    "totalQuestions": 500,
    "passMark": 60,
    "totalMarks": 100,
    "examDurationMinutes": 30,
    "questionsPerExam": 25,
    "marksPerQuestion": 4
  },
  "categories": [
    { "id": 1, "name": "Knowledge Related to Vehicle Operation", "slug": "vehicle-operation", "poolCount": 130, "examWeight": 6 },
    { "id": 2, "name": "Knowledge of Vehicle Laws", "slug": "vehicle-laws", "poolCount": 90, "examWeight": 5 },
    { "id": 3, "name": "Technical and Mechanical Knowledge of Vehicles", "slug": "technical-mechanical", "poolCount": 80, "examWeight": 3 },
    { "id": 4, "name": "Conceptual Knowledge of Environmental Pollution", "slug": "environmental-pollution", "poolCount": 30, "examWeight": 2 },
    { "id": 5, "name": "Knowledge on Accident Awareness", "slug": "accident-awareness", "poolCount": 60, "examWeight": 3 },
    { "id": 6, "name": "Knowledge of Traffic Signs", "slug": "traffic-signs", "poolCount": 110, "examWeight": 6 }
  ],
  "questions": [
    {
      "id": 1,
      "categoryId": 1,
      "question": "While riding a motorcycle/scooter on the road, which of the following actions should not be done?",
      "image": null,
      "options": [
        { "key": "A", "text": "Talking on a mobile phone" },
        { "key": "B", "text": "Smoking while driving" },
        { "key": "C", "text": "Ignoring traffic signals" },
        { "key": "D", "text": "All of the above" }
      ],
      "correctAnswer": "D"
    }
  ]
}
```

### 2.2 PDF Extraction Pipeline
- Python script extracting questions, options, checkmarked answers (`√`), and visual sign images from the PDF (`/Users/theani7/Downloads/Category AK 2082-83 English (1)_rhjjnoh.pdf`).
- Sign graphics cropped and saved to `public/signs/sign_<id>.png` (or embedded SVG if vector).
- Full 500-question automated validation: no empty strings, valid answer keys ('A', 'B', 'C', 'D'), and consistent option counts.

---

## 3. Core Features & User Journeys

### 3.1 Learn Mode (Study & Review)
- **Category Navigation**: Switch seamlessly across categories or study the full 500-question pool.
- **View Toggle**:
  - **Browse / List View**: Scrollable cards with question number, category badge, bookmark toggle, interactive option choices, and "Show Answer" toggle.
  - **Flashcard View**: Focus on one question at a time with keyboard navigation (Arrow keys / Space to reveal).
- **Search & Filter**:
  - Real-time text search across question prompt and option texts.
  - Quick filter: All, Bookmarked, Incorrectly Answered, Traffic Signs only.
- **Answer Reveal**: Instant feedback on clicking an option (green highlight for correct, red highlight for incorrect).

### 3.2 Test Mode (Official Exam Simulation & Category Practice)
- **Official Exam Simulation**:
  - Exactly 25 questions selected according to official DoTM distribution rules:
    - 6 from Category 1
    - 5 from Category 2
    - 3 from Category 3
    - 2 from Category 4
    - 3 from Category 5
    - 6 from Category 6
  - 30:00 countdown timer with subtle urgent alert below 5:00.
  - Question Navigator panel: quick jump, flags for answered/unanswered/marked for review.
  - Finish & Submit modal with confirmation.
- **Category Practice Test**:
  - Mini-test option focusing on a single selected category (e.g. 10 or 20 questions).
- **Result & Performance Analytics**:
  - Pass/Fail banner (Score >= 60 / 100 marks to pass).
  - Category-by-category score breakdown.
  - Comprehensive question-by-question review showing selected option vs correct option.
  - Retake test or retry only incorrect questions.

### 3.3 Bookmarks & Persistence
- Single-click bookmark icon on any question.
- Dedicated "Bookmarks" tab to review saved difficult questions.
- Browser `localStorage` maintains:
  - Bookmarked question IDs
  - Practice history & test attempt records
  - Dark / Light mode preference

---

## 4. Design & UI System
- **Minimalist Aesthetic**: Clean monochromatic slate styling, crisp typography, generous whitespace, subtle borders.
- **Responsive Layout**: Mobile-first responsive design, touch-friendly tap targets for options and navigation.
- **Theme**: Light mode (crisp slate-50/white) and Dark mode (slate-950/deep gray) with instant toggle.
- **Accessibility**: Keyboard shortcuts, semantic HTML, high color contrast, screen-reader friendly aria tags.

---

## 5. Technology Stack
- **Framework**: React 18 / 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React icons
- **State Management**: React Hooks + LocalStorage
- **Data Source**: Standalone static JSON (`public/data/questions.json`)
