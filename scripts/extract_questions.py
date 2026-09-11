#!/usr/bin/env python3
"""
scripts/extract_questions.py
Extracts 500 official driving license exam questions and traffic sign images
from DoTM syllabus PDF into public/data/questions.json and public/signs/.
"""

import json
import os
import re
import sys
from pathlib import Path
import pdfplumber
import fitz  # pymupdf

PDF_PATH = os.environ.get(
    "LICENSE_PDF_PATH",
    "/Users/theani7/Downloads/Category AK 2082-83 English (1)_rhjjnoh.pdf",
)

OUTPUT_JSON_PATH = Path("public/data/questions.json")
OUTPUT_SIGNS_DIR = Path("public/signs")

METADATA = {
    "title": "Category A & K Driving License Written Exam Question Bank",
    "version": "Fiscal Year 2082/2083",
    "totalQuestions": 500,
    "passMark": 60,
    "totalMarks": 100,
    "examDurationMinutes": 30,
    "questionsPerExam": 25,
    "marksPerQuestion": 4,
}

CATEGORIES = [
    {
        "id": 1,
        "name": "Knowledge Related to Vehicle Operation",
        "slug": "vehicle-operation",
        "poolCount": 130,
        "examWeight": 6,
    },
    {
        "id": 2,
        "name": "Knowledge of Vehicle Laws",
        "slug": "vehicle-laws",
        "poolCount": 90,
        "examWeight": 5,
    },
    {
        "id": 3,
        "name": "Technical and Mechanical Knowledge of Vehicles",
        "slug": "technical-mechanical",
        "poolCount": 80,
        "examWeight": 3,
    },
    {
        "id": 4,
        "name": "Conceptual Knowledge of Environmental Pollution",
        "slug": "environmental-pollution",
        "poolCount": 30,
        "examWeight": 2,
    },
    {
        "id": 5,
        "name": "Knowledge on Accident Awareness",
        "slug": "accident-awareness",
        "poolCount": 60,
        "examWeight": 3,
    },
    {
        "id": 6,
        "name": "Knowledge of Traffic Signs",
        "slug": "traffic-signs",
        "poolCount": 110,
        "examWeight": 6,
    },
]


def get_category_id(question_id: int) -> int:
    if 1 <= question_id <= 130:
        return 1
    elif 131 <= question_id <= 220:
        return 2
    elif 221 <= question_id <= 300:
        return 3
    elif 301 <= question_id <= 330:
        return 4
    elif 331 <= question_id <= 390:
        return 5
    elif 391 <= question_id <= 500:
        return 6
    raise ValueError(f"Invalid question ID: {question_id}")


def clean_text(text: str) -> str:
    # Normalize unicode / Cyrillic lookalikes
    text = text.replace("\u0410", "A").replace("\u0430", "a")
    text = text.replace("\u0412", "B")
    text = text.replace("\u0421", "C").replace("\u0441", "c")
    # Fix hyphenated words broken across lines (e.g. T-\njunction -> T-junction)
    text = re.sub(r"(\w+)-\n\s*(\w+)", r"\1-\2", text)
    # Replace newlines and excessive whitespace with a single space
    text = re.sub(r"\s+", " ", text).strip()
    # Correct known upstream source typo in Question 408
    text = text.replace("edge, signalOn which part of the road", "On which part of the road")
    return text


def extract_sign_images(doc: fitz.Document, output_dir: Path):
    """
    Extracts traffic sign images from pages 49 to 58 (questions 416 to 500).
    Saves them as public/signs/sign_<id>.png.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    img_counter = 416

    print("Extracting traffic sign images from PDF...")
    for page_no in range(49, 59):  # 1-indexed pages 49..58
        page = doc[page_no - 1]

        # Find images on this page sorted vertically
        img_list = []
        for img_info in page.get_images():
            xref = img_info[0]
            rects = page.get_image_rects(xref)
            if rects:
                img_list.append((rects[0].y0, xref))
        img_list.sort(key=lambda item: item[0])

        for _, xref in img_list:
            pix = fitz.Pixmap(doc, xref)
            # If CMYK or non-RGB, convert to RGB
            if pix.n >= 5:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            out_file = output_dir / f"sign_{img_counter}.png"
            pix.save(str(out_file))
            img_counter += 1

    extracted_count = img_counter - 416
    print(f"Extracted {extracted_count} traffic sign images to {output_dir}")
    assert extracted_count == 85, f"Expected 85 sign images, got {extracted_count}"


def parse_questions_from_pdf(pdf_path: str):
    """
    Parses table data from PDF pages 4-58, extracts questions, options,
    correct answer checkmarks, and assigns sign image links.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found at: {pdf_path}")

    print(f"Reading PDF from: {pdf_path}")
    fitz_doc = fitz.open(pdf_path)

    # 1. Extract sign images
    extract_sign_images(fitz_doc, OUTPUT_SIGNS_DIR)

    # 2. Extract table rows using pdfplumber
    print("Extracting question tables using pdfplumber...")
    rows_by_page = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_no in range(4, 59):  # pages 4 to 58 (1-indexed)
            page = pdf.pages[page_no - 1]
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    cells = [c.strip() if c else "" for c in row]
                    rows_by_page.append((page_no, cells))

    # 3. Assemble question rows, handling multi-page split rows
    raw_questions = []
    for page_no, cells in rows_by_page:
        first = next((c for c in cells if c), "")
        if first.isdigit():
            q_id = int(first)
            # Find the cell containing question text
            q_text = ""
            for c in cells[1:]:
                c_clean = clean_text(c)
                if len(c) > 5 and any(
                    k in c_clean
                    for k in [
                        "(A)",
                        "(a)",
                        "What",
                        "Which",
                        "How",
                        "Where",
                        "When",
                        "Why",
                        "Who",
                        "In",
                        "According",
                        "While",
                        "Under",
                        "If",
                    ]
                ):
                    q_text = c
                    break
            raw_questions.append({
                "id": q_id,
                "text": q_text,
                "cells": cells,
                "page": page_no,
            })
        else:
            # Check if this is a continuation row of options
            text_cell = ""
            for c in cells:
                c_clean = clean_text(c)
                if any(m in c_clean for m in ["(A)", "(B)", "(C)", "(D)"]):
                    text_cell = c
                    break
            if text_cell and raw_questions:
                raw_questions[-1]["text"] += "\n" + text_cell

    print(f"Collected raw question rows: {len(raw_questions)}")
    assert len(raw_questions) == 500, f"Expected 500 questions, got {len(raw_questions)}"

    # 4. Process each question: options, answer, image
    questions = []
    option_regex = re.compile(
        r"^(.*?)\s*\(A\)\s*(.*?)\s*\(B\)\s*(.*?)\s*\(C\)\s*(.*?)\s*\(D\)\s*(.*)$",
        re.DOTALL | re.IGNORECASE,
    )

    for item in raw_questions:
        q_id = item["id"]
        full_text = clean_text(item["text"])
        cells = item["cells"]

        # Parse prompt and options
        match = option_regex.search(full_text)
        if not match:
            raise ValueError(f"Failed to parse options for Q{q_id}: {full_text}")

        prompt, opt_a, opt_b, opt_c, opt_d = match.groups()
        prompt = clean_text(prompt)
        opt_a = clean_text(opt_a)
        opt_b = clean_text(opt_b)
        opt_c = clean_text(opt_c)
        opt_d = clean_text(opt_d)

        # Determine correct answer column
        correct_answer = None
        num_cells = len(cells)
        for idx, cell in enumerate(cells):
            if "√" in cell:
                if num_cells == 18:
                    mapping = {6: "A", 9: "B", 12: "C", 15: "D"}
                    correct_answer = mapping.get(idx)
                elif num_cells == 10:
                    mapping = {6: "A", 7: "B", 8: "C", 9: "D"}
                    correct_answer = mapping.get(idx)
                elif num_cells == 11:
                    mapping = {7: "A", 8: "B", 9: "C", 10: "D"}
                    correct_answer = mapping.get(idx)

        if not correct_answer:
            raise ValueError(f"Could not determine correct answer for Q{q_id} (cells={cells})")

        # Assign image path if traffic sign diagram exists
        image_path = None
        if 416 <= q_id <= 500:
            image_path = f"/signs/sign_{q_id}.png"

        questions.append({
            "id": q_id,
            "categoryId": get_category_id(q_id),
            "question": prompt,
            "image": image_path,
            "options": [
                {"key": "A", "text": opt_a},
                {"key": "B", "text": opt_b},
                {"key": "C", "text": opt_c},
                {"key": "D", "text": opt_d},
            ],
            "correctAnswer": correct_answer,
        })

    # Sort questions by ID
    questions.sort(key=lambda q: q["id"])

    # Output JSON structure
    output_data = {
        "metadata": METADATA,
        "categories": CATEGORIES,
        "questions": questions,
    }

    OUTPUT_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"Successfully saved {len(questions)} questions to {OUTPUT_JSON_PATH}")


def main():
    try:
        parse_questions_from_pdf(PDF_PATH)
    except Exception as e:
        print(f"Extraction failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
