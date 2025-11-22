from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# -----------------------------------------
# SENTIMENT MODEL
# -----------------------------------------
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

class JournalInput(BaseModel):
    text: str


# -----------------------------------------
# GLOBAL STRESS KEYWORDS (USED EVERYWHERE)
# -----------------------------------------
STRESS_KEYWORDS = {
    "stress": 12, "stressed": 12, "anxious": 15, "anxiety": 15,
    "worry": 10, "worried": 10, "panic": 10, "fear": 10,
    "sad": 8, "tired": 8, "overwhelmed": 12, "depressed": 20,
    "angry": 12, "frustrated": 10, "lonely": 12
}


# -----------------------------------------
# STRESS CALCULATION
# -----------------------------------------
def compute_stress(text: str, sentiment_score: float) -> int:
    text = text.lower()

    # 1. Base Stress from sentiment
    base_stress = 50 - (sentiment_score * 35)

    # 2. Raw keyword hits
    raw_hits = sum(val for key, val in STRESS_KEYWORDS.items() if key in text)

    # 3. Dampened keyword impact
    keyword_contribution = min(raw_hits, 30)

    # 4. Apply based on positive / neutral / negative
    if sentiment_score < -0.1:
        stress = base_stress + keyword_contribution
    elif sentiment_score > 0.1:
        stress = base_stress - (keyword_contribution / 2)
    else:
        stress = base_stress + (keyword_contribution / 2)

    # Clamp 0–100
    return max(0, min(100, int(stress)))


# -----------------------------------------
# EMOTION DETECTION
# -----------------------------------------
def infer_emotion(score, text):
    text = text.lower()

    if "anxiety" in text or "anxious" in text:
        return "anxious"
    if "angry" in text or "frustrated" in text:
        return "angry"
    if "sad" in text or "depress" in text:
        return "sad"

    if score > 0.65:
        return "happy"
    if score < -0.65:
        return "sad"

    return "neutral"


# -----------------------------------------
# ANALYZE ENDPOINT
# -----------------------------------------
@app.post("/analyze")
def analyze(journal: JournalInput):
    text = journal.text.lower()

    # Crisis detection
    crisis_words = ["suicide", "kill myself", "self harm", "die", "end my life"]
    if any(w in text for w in crisis_words):
        return {
            "sentimentScore": -1.0,
            "stressLevel": 100,
            "emotion": "critical",
            "keywords": ["crisis", "immediate support required"]
        }

    # Sentiment analysis
    res = sentiment_analyzer(journal.text[:512])[0]
    sentiment_score = float(res["score"]) if res["label"] == "POSITIVE" else -float(res["score"])

    # Stress calculation
    stress = compute_stress(journal.text, sentiment_score)

    # Emotion inferred
    emotion = infer_emotion(sentiment_score, journal.text)

    # Extract general words
    words = [
        w.strip(".,!?;:()[]\"'")
        for w in text.split()
        if len(w) > 4
    ]

    # Extract stress-related words
    stress_keywords = [k for k in STRESS_KEYWORDS if k in text]

    # Final 5 keywords max
    keywords = list(dict.fromkeys(stress_keywords + words))[:5]

    return {
        "sentimentScore": sentiment_score,
        "stressLevel": stress,
        "emotion": emotion,
        "keywords": keywords
    }


# -----------------------------------------
# TASK GENERATION ENDPOINT
# -----------------------------------------
@app.post("/generate-tasks")
def generate_tasks(journal: JournalInput):
    text = journal.text.lower()

    # Sentiment
    sentiment_res = sentiment_analyzer(text[:512])[0]
    sentiment_score = float(sentiment_res["score"]) if sentiment_res["label"] == "POSITIVE" else -float(sentiment_res["score"])

    # Keyword task rules
    keywords_map = {
        "stress": "Do 5 minutes of deep breathing",
        "stressed": "Do 5 minutes of deep breathing",
        "anxiety": "Practice slow breathing for 3 minutes",
        "anxious": "Practice slow breathing for 3 minutes",
        "worried": "Write down your worries and one solution",
        "tired": "Take a 10-minute rest and drink water",
        "fear": "Ground yourself and focus on your breath",
        "overwhelmed": "Break your work into 3 smaller tasks",
        "sad": "Write 2 things that made you smile",
        "lonely": "Call a friend for 5 minutes",
        "angry": "Take a brisk walk for 5 minutes",
        "frustrated": "Take a brisk walk for 5 minutes",
        "depressed": "Write one positive affirmation",
        "happy": "Celebrate a small win today",
        "motivated": "Plan one productive task today"
    }

    detected_keywords = [k for k in keywords_map if k in text]
    tasks = []

    # Add up to 2 tasks based on keywords
    for k in detected_keywords:
        if len(tasks) < 2:
            tasks.append(keywords_map[k])

    # Emotion fallback tasks
    emotion_tasks = {
        "positive": [
            "Write 3 things you are grateful for",
            "Do a 2-minute smiling exercise",
            "Message someone you care about"
        ],
        "negative": [
            "Do a 2-minute relaxation exercise",
            "Drink a glass of water slowly",
            "Write one kind sentence to yourself"
        ],
        "neutral": [
            "Write one goal for today",
            "Take 10 deep breaths",
            "Stretch your body for 1 minute"
        ]
    }

    # Simple emotion classifier
    def infer_simple_emotion(score):
        if score > 0.4:
            return "positive"
        if score < -0.4:
            return "negative"
        return "neutral"

    emotion_type = infer_simple_emotion(sentiment_score)

    # Fill tasks to 3
    for t in emotion_tasks[emotion_type]:
        if len(tasks) >= 3:
            break
        if t not in tasks:
            tasks.append(t)

    # Exactly 3 tasks
    return {"tasks": tasks[:3]}
