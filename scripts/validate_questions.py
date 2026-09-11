#!/usr/bin/env python3
"""
scripts/validate_questions.py
Validates the extracted questions dataset against all 6 criteria from the task brief:
1. Total questions count == 500.
2. Each question has non-empty question string.
3. Each question has exactly 4 options (A, B, C, D) with non-empty text.
4. Each question's correctAnswer is in ['A', 'B', 'C', 'D'].
5. Category distribution matches official DoTM counts (130, 90, 80, 30, 60, 110).
6. All image paths referenced actually exist on disk.
"""

import json
import os
import sys
from pathlib import Path
from collections import Counter

DATA_PATH = Path("public/data/questions.json")
EXPECTED_CATEGORIES = {
    1: {"name": "Knowledge Related to Vehicle Operation", "count": 130},
    2: {"name": "Knowledge of Vehicle Laws", "count": 90},
    3: {"name": "Technical and Mechanical Knowledge of Vehicles", "count": 80},
    4: {"name": "Conceptual Knowledge of Environmental Pollution", "count": 30},
    5: {"name": "Knowledge on Accident Awareness", "count": 60},
    6: {"name": "Knowledge of Traffic Signs", "count": 110},
}
EXPECTED_TOTAL = 500
VALID_KEYS = ["A", "B", "C", "D"]


def validate():
    errors = []
    warnings = []

    if not DATA_PATH.exists():
        print(f"FAIL: Data file not found at {DATA_PATH}", file=sys.stderr)
        sys.exit(1)

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"FAIL: Invalid JSON in {DATA_PATH}: {e}", file=sys.stderr)
            sys.exit(1)

    # Validate top-level schema
    if "questions" not in data or not isinstance(data["questions"], list):
        print("FAIL: Root object missing 'questions' list", file=sys.stderr)
        sys.exit(1)

    questions = data["questions"]

    # 1. Total questions count == 500
    total_count = len(questions)
    print(f"Check 1: Total questions count ({total_count}/{EXPECTED_TOTAL})...", end=" ")
    if total_count != EXPECTED_TOTAL:
        errors.append(f"Total questions count is {total_count}, expected {EXPECTED_TOTAL}")
        print("FAILED")
    else:
        print("PASSED")

    # Tracking for checks
    category_counts = Counter()
    image_count = 0
    question_ids = set()

    for idx, q in enumerate(questions):
        qid = q.get("id")
        if qid is None:
            errors.append(f"Question at index {idx} has no 'id'")
            continue

        if qid in question_ids:
            errors.append(f"Duplicate question id: {qid}")
        question_ids.add(qid)

        # 2. Non-empty question string
        q_text = q.get("question")
        if not q_text or not isinstance(q_text, str) or not q_text.strip():
            errors.append(f"Q{qid}: 'question' is empty or invalid: {q_text!r}")

        # 3. Exactly 4 options (A, B, C, D) with non-empty text
        options = q.get("options")
        if not isinstance(options, list) or len(options) != 4:
            errors.append(f"Q{qid}: options count is {len(options) if isinstance(options, list) else 0}, expected 4")
        else:
            seen_keys = []
            for opt in options:
                k = opt.get("key")
                t = opt.get("text")
                seen_keys.append(k)
                if not t or not isinstance(t, str) or not t.strip():
                    errors.append(f"Q{qid} Option {k}: text is empty: {t!r}")
            if seen_keys != VALID_KEYS:
                errors.append(f"Q{qid}: option keys are {seen_keys}, expected {VALID_KEYS}")

        # 4. correctAnswer in ['A', 'B', 'C', 'D']
        ans = q.get("correctAnswer")
        if ans not in VALID_KEYS:
            errors.append(f"Q{qid}: invalid correctAnswer: {ans!r}")

        # 5. Category distribution tracking
        cat_id = q.get("categoryId")
        category_counts[cat_id] += 1

        # 6. Check image references
        img = q.get("image")
        if img is not None:
            image_count += 1
            # img path relative to public/
            # e.g. "/signs/sign_416.png" -> "public/signs/sign_416.png"
            clean_img_path = img.lstrip("/")
            full_path = Path("public") / clean_img_path
            if not full_path.exists():
                errors.append(f"Q{qid}: referenced image does not exist on disk: {full_path}")
            elif full_path.stat().st_size == 0:
                errors.append(f"Q{qid}: referenced image is 0 bytes: {full_path}")

    # Check 2 results
    print("Check 2: Non-empty question strings...", end=" ")
    check2_errors = [e for e in errors if "'question' is empty" in e]
    if check2_errors:
        print(f"FAILED ({len(check2_errors)} errors)")
    else:
        print("PASSED")

    # Check 3 results
    print("Check 3: Exactly 4 non-empty options (A, B, C, D)...", end=" ")
    check3_errors = [e for e in errors if "options count" in e or "text is empty" in e or "option keys" in e]
    if check3_errors:
        print(f"FAILED ({len(check3_errors)} errors)")
    else:
        print("PASSED")

    # Check 4 results
    print("Check 4: Valid correctAnswer in ['A', 'B', 'C', 'D']...", end=" ")
    check4_errors = [e for e in errors if "invalid correctAnswer" in e]
    if check4_errors:
        print(f"FAILED ({len(check4_errors)} errors)")
    else:
        print("PASSED")

    # Check 5: Category distribution matches official DoTM counts
    print("Check 5: Category distribution matches official DoTM counts...", end=" ")
    cat_distribution_ok = True
    for cid, exp in EXPECTED_CATEGORIES.items():
        actual = category_counts[cid]
        if actual != exp["count"]:
            cat_distribution_ok = False
            errors.append(
                f"Category {cid} ('{exp['name']}'): got {actual} questions, expected {exp['count']}"
            )
    if cat_distribution_ok:
        print("PASSED")
    else:
        print("FAILED")

    # Check 6: Image paths exist on disk
    print(f"Check 6: Image references verification ({image_count} images found)...", end=" ")
    check6_errors = [e for e in errors if "referenced image" in e]
    if check6_errors:
        print(f"FAILED ({len(check6_errors)} errors)")
    else:
        print("PASSED")

    # Answer distribution diagnostic
    ans_counts = Counter(q["correctAnswer"] for q in questions if "correctAnswer" in q)
    print("\n--- Diagnostics Summary ---")
    print(f"Total Questions: {len(questions)}")
    print(f"Total Images: {image_count}")
    print("Category Breakdown:")
    for cid, exp in EXPECTED_CATEGORIES.items():
        print(f"  Cat {cid} ({exp['name']}): {category_counts[cid]}/{exp['count']}")
    print(f"Answer Key Distribution: A={ans_counts['A']}, B={ans_counts['B']}, C={ans_counts['C']}, D={ans_counts['D']}")

    if errors:
        print(f"\nVALIDATION FAILED with {len(errors)} errors:", file=sys.stderr)
        for err in errors[:20]:
            print(f"  - {err}", file=sys.stderr)
        if len(errors) > 20:
            print(f"  ... and {len(errors) - 20} more errors", file=sys.stderr)
        sys.exit(1)

    print("\nSUCCESS: All 500 questions passed validation completely (6/6 checks passed)!")
    return True


if __name__ == "__main__":
    validate()
