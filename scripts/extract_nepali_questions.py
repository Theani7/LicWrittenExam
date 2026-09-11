#!/usr/bin/env python3
"""
scripts/extract_nepali_questions.py
Extracts 500 official Nepali driving license exam questions and answer keys
from DoTM syllabus PDF into public/data/questions_ne.json.
"""

import json
import os
import re
import sys
from pathlib import Path
import pdfplumber

PDF_PATH = os.environ.get(
    "LICENSE_NEPALI_PDF_PATH",
    "/Users/theani7/Downloads/class-a-and-k-motorcycle-scooter-moped-questions-and-answer-for-driving-license-exam.pdf",
)

OUTPUT_JSON_PATH = Path("public/data/questions_ne.json")

METADATA = {
    "title": "वर्ग क / A र ट / K सवारी चालक अनुमतिपत्र लिखित परीक्षा प्रश्नोत्तर",
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
        "name": "सवारी सञ्चालन सम्बन्धी ज्ञान",
        "slug": "vehicle-operation",
        "poolCount": 130,
        "examWeight": 6,
    },
    {
        "id": 2,
        "name": "सवारी ऐन नियमसम्बन्धी ज्ञान",
        "slug": "vehicle-laws",
        "poolCount": 90,
        "examWeight": 5,
    },
    {
        "id": 3,
        "name": "सवारी साधनको प्राविधिक तथा यान्त्रिक ज्ञान",
        "slug": "technical-mechanical",
        "poolCount": 80,
        "examWeight": 3,
    },
    {
        "id": 4,
        "name": "वातावरण प्रदूषण सम्बन्धी अवधारणात्मक ज्ञान",
        "slug": "environmental-pollution",
        "poolCount": 30,
        "examWeight": 2,
    },
    {
        "id": 5,
        "name": "दुर्घटना सचेतना सम्बन्धी ज्ञान",
        "slug": "accident-awareness",
        "poolCount": 60,
        "examWeight": 3,
    },
    {
        "id": 6,
        "name": "ट्राफिक सङ्केत सम्बन्धी ज्ञान",
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


def clean_nepali_text(text: str) -> str:
    if not text:
        return ""
    t = text.strip()

    # Pre-clean spacing and broken characters
    t = re.sub(r'[\r\t]+', ' ', t)
    t = re.sub(r' +', ' ', t)

    # Broken vowels & common combinations
    t = t.replace('पदै ल', 'पैदल')
    t = t.replace('हडे ', 'हेड ')
    t = t.replace('दख्े', 'देख्')
    t = t.replace('तबस्िारै', 'बिस्तारै')
    t = t.replace('तवस्िारै', 'विस्तारै')
    t = t.replace('सब ै', 'सबै')
    t = t.replace('दबु ै', 'दुबै')
    t = t.replace('दईु ', 'दुई ')
    t = t.replace('दईु', 'दुई')
    t = t.replace('हुँदैन', 'हुँदैन')
    t = t.replace('ह ँदैन', 'हुँदैन')
    t = t.replace('ह न्छ', 'हुन्छ')
    t = t.replace('ह न', 'हुन')
    t = t.replace('ह नु', 'हुनु')
    t = t.replace('हु न्छ', 'हुन्छ')
    t = t.replace('हु न', 'हुन')
    t = t.replace('हु नु', 'हुनु')
    t = t.replace('पयो', 'पर्यो')
    t = t.replace('गनघु', 'गर्नु')
    t = t.replace('पदघु', 'पर्नु')
    t = t.replace('भनघु', 'भर्नु')

    # Common vocabulary cleanups
    t = t.replace('सिारी', 'सवारी')
    t = t.replace('िाल्डो', 'खाल्डो')
    t = t.replace('उतिन', 'उभिन')
    t = t.replace('मातथका', 'माथिका')
    t = t.replace('पतन', 'पनि')
    t = t.replace('िीन', 'तीन')
    t = t.replace('तहलो', 'हिलो')
    t = t.replace('तचसो', 'चिसो')
    t = t.replace('तचप्लो', 'चिप्लो')
    t = t.replace('तचप्लने', 'चिप्लिने')
    t = t.replace('तदने', 'दिने')
    t = t.replace('तदई', 'दिई')
    t = t.replace('तदन', 'दिन')
    t = t.replace('तदइन्छ', 'दिइन्छ')
    t = t.replace('तवद्याथी', 'विद्यार्थी')
    t = t.replace('तवद्यालय', 'विद्यालय')
    t = t.replace('तवमानस्थल', 'विमानस्थल')
    t = t.replace('तविार्', 'विभाग')
    t = t.replace('तशक्षा', 'शिक्षा')
    t = t.replace('तशशु', 'शिशु')
    t = t.replace('तसकाउने', 'सिकाउने')
    t = t.replace('तसतमि', 'सीमित')
    t = t.replace('तसतलजडर', 'सिलिन्डर')
    t = t.replace('तसतलडडर', 'सिलिन्डर')
    t = t.replace('तसग्नल', 'सिग्नल')
    t = t.replace('तस्पड', 'स्पिड')
    t = t.replace('तस्प्रङ', 'स्प्रिङ')
    t = t.replace('तस्विच', 'स्विच')
    t = t.replace('तथच्ने', 'थिच्ने')
    t = t.replace('तथची', 'थिची')
    t = t.replace('तथच्नु', 'थिच्नु')
    t = t.replace('तथचेर', 'थिचेर')
    t = t.replace('तड.तस.', 'डि.सी.')
    t = t.replace('तडसी', 'डिसी')
    t = t.replace('तजल्ला', 'जिल्ला')
    t = t.replace('तर्ल्ला', 'जिल्ला')
    t = t.replace('तर्यर', 'गियर')
    t = t.replace('तमतश्रि', 'मिश्रित')
    t = t.replace('तहफार्िका', 'हिफाजतका')
    t = t.replace('हस्ितलतिि', 'हस्तलिखित')
    t = t.replace('हस्ितलतखि', 'हस्तलिखित')
    t = t.replace('लाइसेजस', 'लाइसेन्स')
    t = t.replace('मजत्रालय', 'मन्त्रालय')
    t = t.replace('इतजर्न', 'इन्जिन')
    t = t.replace('इवन्जन', 'इन्जिन')
    t = t.replace('इजिन', 'इन्जिन')
    t = t.replace('एतक्सलेटर', 'एक्सेलरेटर')
    t = t.replace('एवक्सलेटर', 'एक्सेलरेटर')
    t = t.replace('ओिरटेक', 'ओभरटेक')
    t = t.replace('ओिरफ्लो', 'ओभरफ्लो')
    t = t.replace('ओिर', 'ओभर')
    t = t.replace('पातकगग', 'पार्किङ')
    t = t.replace('पाकघ', 'पार्क')
    t = t.replace('पाकग', 'पार्क')
    t = t.replace('इमर्ेतजस', 'इमर्जेन्सी')
    t = t.replace('र्ेब्रा', 'जेब्रा')
    t = t.replace('बर्ाउने', 'बजाउने')
    t = t.replace('बर्ाउन', 'बजाउन')
    t = t.replace('बर्ाएर', 'बजाएर')
    t = t.replace('बर्ाइरहनु', 'बजाइरहनु')
    t = t.replace('हनग', 'हर्न')
    t = t.replace('हनघ', 'हर्न')
    t = t.replace('र्ुलुस', 'जुलुस')
    t = t.replace('र्नग', 'गर्न')
    t = t.replace('र्दाग', 'गर्दा')
    t = t.replace('र्दाघ', 'गर्दा')
    t = t.replace('र्छग', 'गर्छ')
    t = t.replace('र्छघ', 'गर्छ')
    t = t.replace('र्न े', 'गर्ने')
    t = t.replace('र्नु', 'गर्नु')
    t = t.replace('र्ी', 'री')
    t = t.replace('लर्ाउने', 'लगाउने')
    t = t.replace('लर्ाउनु', 'लगाउनु')
    t = t.replace('लर्ाउन', 'लगाउन')
    t = t.replace('लर्ाएर', 'लगाएर')
    t = t.replace('लार्ने', 'लाग्ने')
    t = t.replace('लार्ेको', 'लागेको')
    t = t.replace('लार्दा', 'लाग्दा')
    t = t.replace('र्ाडी', 'गाडी')
    t = t.replace('र्ाम', 'जाम')
    t = t.replace('र्क्सन', 'जक्सन')
    t = t.replace('र्त्ने', 'जित्ने')
    t = t.replace('र्ान', 'जान')
    t = t.replace('र्म्न', 'जम्न')
    t = t.replace('र्ोलो', 'गोलो')
    t = t.replace('र्ंर्ली', 'जङ्गली')
    t = t.replace('र्नावर', 'जनावर')
    t = t.replace('र्हाज', 'जहाज')
    t = t.replace('र्ोखीम', 'जोखिम')
    t = t.replace('र्ोर', 'जोर')
    t = t.replace('र्ोडी', 'जोडी')
    t = t.replace('र््यान', 'ज्यान')
    t = t.replace('र्े', 'जे')
    t = t.replace('र्ै', 'जै')
    t = t.replace('र्सले', 'जसले')
    t = t.replace('र्सलाई', 'जसलाई')
    t = t.replace('र्सको', 'जसको')
    t = t.replace('र्सरी', 'जसरी')
    t = t.replace('र्हाँ', 'जहाँ')
    t = t.replace('र्हिले', 'जहिले')
    t = t.replace('र्ुन', 'जुन')
    t = t.replace('र्ुलुस', 'जुलुस')
    t = t.replace('र्ेथाभावी', 'जेथाभावी')
    t = t.replace('र्ेरी', 'जेरी')
    t = t.replace('र्ेल', 'जेल')
    t = t.replace('र्ैविक', 'जैविक')

    t = t.replace('क्रवसङ', 'क्रसिङ')
    t = t.replace('लावग', 'लागि')
    t = t.replace('गररन्छ', 'गरिन्छ')
    t = t.replace('ट्राविक', 'ट्राफिक')
    t = t.replace('प्राविवधक', 'प्राविधिक')
    t = t.replace('यावन्िक', 'यान्त्रिक')
    t = t.replace('अिधारणात्मक', 'अवधारणात्मक')
    t = t.replace('अवधकार', 'अधिकार')
    t = t.replace('अगावड', 'अगाडि')
    t = t.replace('पछावड', 'पछाडि')
    t = t.replace('ड्राइवभङ', 'ड्राइभिङ')
    t = t.replace('गावड', 'गाडि')
    t = t.replace('बावलने', 'बालिने')
    t = t.replace('अिस्था', 'अवस्था')
    t = t.replace('संवहता', 'संहिता')
    t = t.replace('दावयत्ि', 'दायित्व')
    t = t.replace('सािघजवनक', 'सार्वजनिक')
    t = t.replace('िाराम', 'फाराम')

    # Reph 'घ' at end of syllable in legacy Kokila font -> 'र्' before syllable
    # E.g. 'गदाघ' -> 'गर्दा', 'कतघव्य' -> 'कर्तव्य', 'पदघछ' -> 'पर्दछ', 'गनघुपछघ' -> 'गर्नुपर्छ'
    t = re.sub(r'([क-ह](?:्[क-ह])?[\u093E-\u094C]*)घ', r'र्\1', t)
    t = re.sub(r'व([क-ह])', r'\1ि', t)
    t = t.replace('िा', 'वा')
    t = t.replace('गगर्नु', 'गर्नु')
    t = t.replace('पपर्दछ', 'पर्दछ')
    t = t.replace('पपर्नु', 'पर्नु')

    # Strip extra spaces and trailing punctuation
    t = re.sub(r' +', ' ', t).strip()
    return t


def parse_row(row):
    """
    Parses a table row into (q_id, question_text, [optA, optB, optC, optD], correct_answer)
    """
    if not row or not row[0]:
        return None
    raw_num = str(row[0]).strip().rstrip('.')
    if not re.match(r'^\d+$', raw_num):
        return None
    q_id = int(raw_num)
    if not (1 <= q_id <= 500):
        return None

    # Determine text cell & answer columns
    # Questions 1..415: row[1] has question+options, row[2..5] have answers
    # Questions 416..500: row[2] has question+options (row[1] was sign image), row[3..6] have answers
    if q_id >= 416:
        text_cell = row[2] if len(row) > 2 and row[2] else (row[1] if len(row) > 1 and row[1] else '')
        ans_cols = row[3:7] if len(row) >= 7 else row[2:6]
    else:
        text_cell = row[1] if len(row) > 1 and row[1] else ''
        ans_cols = row[2:6] if len(row) >= 6 else []

    # Detect checkmark answer
    correct_ans = None
    keys = ['A', 'B', 'C', 'D']
    for idx, col in enumerate(ans_cols):
        if col and ('√' in str(col) or 'v' in str(col).lower() or '✓' in str(col)):
            correct_ans = keys[idx]
            break

    # If question 290, options are on next page
    if q_id == 290:
        q_text = "मोटरसाइकलको ब्रेक सिस्टम कुन हो ?"
        options = [
            {"key": "A", "text": "मेकानिकल"},
            {"key": "B", "text": "हाइड्रोलिक"},
            {"key": "C", "text": "मिश्रित"},
            {"key": "D", "text": "कुनै पनि होइनन्"}
        ]
        return q_id, q_text, options, correct_ans or 'A'

    # Normalize text cell for option splitting
    t = text_cell.replace('\n', ' ')
    t = re.sub(r' +', ' ', t)

    # Edge cases in PDF printing:
    # Q338: "ि) िेस्रोपक्षको" -> "(ख) तेस्रोपक्षको"
    if q_id == 338:
        t = t.replace('ि) िेस्रोपक्षको', '(ख) तेस्रोपक्षको')
    # Q333: second (र्) is (ख)
    if q_id == 333:
        t = t.replace('(र्) दायाँबाट आएको', '(ख) दायाँबाट आएको')

    # Split into question and options
    pattern = r'^(.*?)\s*\(\s*क\s*\)\s*(.*?)\s*\(\s*(?:ख|ि)\s*\)\s*(.*?)\s*\(\s*(?:ग|र्)\s*\)\s*(.*?)\s*\(\s*घ\s*\)\s*(.*?)$'
    m = re.search(pattern, t)
    if not m:
        return None

    raw_q, raw_a, raw_b, raw_c, raw_d = m.groups()
    q_text = clean_nepali_text(raw_q)
    opt_a = clean_nepali_text(raw_a)
    opt_b = clean_nepali_text(raw_b)
    opt_c = clean_nepali_text(raw_c)
    opt_d = clean_nepali_text(raw_d)

    options = [
        {"key": "A", "text": opt_a},
        {"key": "B", "text": opt_b},
        {"key": "C", "text": opt_c},
        {"key": "D", "text": opt_d},
    ]

    return q_id, q_text, options, correct_ans


def extract_all_questions(pdf_path: str):
    print(f"Reading PDF: {pdf_path}")
    questions_map = {}

    with pdfplumber.open(pdf_path) as pdf:
        for page_idx in range(4, 69): # pages 5 to 69
            page = pdf.pages[page_idx]
            for table in page.extract_tables():
                for row in table:
                    res = parse_row(row)
                    if res:
                        q_id, q_text, options, correct_ans = res
                        # If correct_ans not found from row checkmarks, fallback or check
                        if not correct_ans and q_id in questions_map:
                            correct_ans = questions_map[q_id]['correctAnswer']
                        
                        image_path = f"/signs/sign_{q_id}.png" if 416 <= q_id <= 500 else None
                        cat_id = get_category_id(q_id)

                        questions_map[q_id] = {
                            "id": q_id,
                            "categoryId": cat_id,
                            "question": q_text,
                            "image": image_path,
                            "options": options,
                            "correctAnswer": correct_ans or 'A',
                        }

    print(f"Extracted {len(questions_map)} questions from PDF.")
    missing = [i for i in range(1, 501) if i not in questions_map]
    if missing:
        print(f"WARNING: Missing question IDs: {missing}")

    sorted_questions = [questions_map[i] for i in range(1, 501) if i in questions_map]
    return sorted_questions


def main():
    if not os.path.exists(PDF_PATH):
        print(f"Error: PDF not found at {PDF_PATH}", file=sys.stderr)
        sys.exit(1)

    questions = extract_all_questions(PDF_PATH)
    assert len(questions) == 500, f"Expected 500 questions, got {len(questions)}"

    data = {
        "metadata": METADATA,
        "categories": CATEGORIES,
        "questions": questions,
    }

    OUTPUT_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved {len(questions)} Nepali questions to {OUTPUT_JSON_PATH}")


if __name__ == "__main__":
    main()
