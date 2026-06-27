import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
client = genai.GenerativeModel(MODEL)


def analyze_image(image_path: str, standard: str) -> dict:
    with open(image_path, "rb") as f:
        image_data = f.read()

    # Detect mime type
    ext = image_path.split(".")[-1].lower()
    mime_map = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}
    mime_type = mime_map.get(ext, "image/jpeg")

    prompt = f"""
You are a professional compliance auditor. Analyze this image for compliance with the standard: "{standard}".

Return ONLY a valid JSON object with no markdown, no code blocks, no extra text. Just raw JSON like this:
{{
  "score": <number 0-100>,
  "gaps": [
    "<gap 1 with explanation>",
    "<gap 2 with explanation>",
    "<gap 3 with explanation>"
  ],
  "action_plan": [
    "<action step 1>",
    "<action step 2>",
    "<action step 3>"
  ]
}}

Be specific about what you see in the image. Score should reflect actual compliance level.
"""

    response = client.generate_content(
      [
        prompt,
        {"mime_type": mime_type, "data": image_data},
      ]
    )

    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()

    return json.loads(text)


def generate_interview_questions(standard: str, gaps: list) -> list:
    gaps_text = "\n".join(gaps[:3])

    prompt = f"""
You are a compliance expert. Generate exactly 5 interview questions to test someone's knowledge about "{standard}" compliance.

Focus on these detected gaps:
{gaps_text}

Return ONLY a valid JSON array with no markdown, no code blocks. Like this:
[
  {{
    "question": "<question text>",
    "context": "<brief context or what a good answer should cover>"
  }}
]

Make questions practical and specific to the standard.
"""

    response = client.generate_content(prompt)
    text = response.text.strip()

    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()

    questions = json.loads(text)
    return questions[:5]


def score_answer(question: str, answer: str, standard: str) -> dict:
    prompt = f"""
You are a compliance examiner evaluating an answer about "{standard}" compliance.

Question: {question}
Candidate's Answer: {answer}

Score the answer from 0 to 10 and give brief feedback.

Return ONLY a valid JSON object:
{{
  "score": <number 0-10>,
  "feedback": "<one or two sentence feedback>"
}}
"""

    response = client.generate_content(prompt)
    text = response.text.strip()

    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()

    return json.loads(text)