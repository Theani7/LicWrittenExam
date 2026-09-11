# Contributing

Thanks for helping improve Nepal License Written Prep! This guide keeps contributions smooth and reviewable.

## Ways to contribute

- **Question fixes** — wrong answers, typos, bad Nepali translations (please cite the question number, e.g. Q12)
- **Features & UI** — new practice modes, accessibility, mobile UX, performance
- **Docs & tests** — README clarity, dataset validation, test coverage

## Workflow

1. **Fork** the repo and create a focused branch:
   `git checkout -b fix/q12-correct-answer` or `feat/flashcard-progress`
2. **Install & verify:**
   ```bash
   npm install
   npm test
   npm run build
   ```
3. **Commit** with [Conventional Commits](https://www.conventionalcommits.org/):
   `feat(...)`, `fix(...)`, `docs(...)`, `style(...)`, `refactor(...)`, `test(...)`, `chore(...)`
4. **Push** and open a Pull Request against `master` using the PR template.

## PR checklist

- [ ] `npm test` passes (add/update tests for behavior changes)
- [ ] `npm run build` passes (`tsc` is strict — no unused locals/params)
- [ ] Scope is focused — one feature/fix per PR
- [ ] Screenshots included for visible UI changes (light + dark mode if affected)
- [ ] Question-data changes validated with `scripts/validate_questions.py` where applicable

## Code guidelines

- TypeScript strict mode; React function components + hooks
- Tailwind for styling — mobile-first, 44px+ touch targets, `dark:` variants for new UI
- Keep `data-testid` attributes stable — tests rely on them
- No new runtime network calls — the app is 100% client-side by design

## Reporting issues

Use the issue templates (bug report / feature request). For wrong exam content, include the question number, what it currently says, and the correct official answer with a source if possible.
