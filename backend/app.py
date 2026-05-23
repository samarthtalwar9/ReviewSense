import os
import pickle
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils import preprocess_text

app = FastAPI(
    title="ReviewSense AI Sentiment Backend",
    description="Production-ready NLP sentiment prediction server",
    version="1.0"
)

# Load CORS origins from environment variables (default to '*' if not specified)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained models
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "model.pkl")
vectorizer_path = os.path.join(current_dir, "vectorizer.pkl")

if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
    raise RuntimeError("Trained model or vectorizer file not found. Run train_model.py first.")

try:
    with open(model_path, "rb") as m_file:
        model = pickle.load(m_file)
    with open(vectorizer_path, "rb") as v_file:
        vectorizer = pickle.load(v_file)
except Exception as e:
    raise RuntimeError(f"Error loading pickle models: {str(e)}")

class PredictRequest(BaseModel):
    review: str

class PredictResponse(BaseModel):
    sentiment: str
    confidence: float

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "ReviewSense AI Sentiment Intelligence",
        "api_docs": "/docs"
    }

@app.post("/predict", response_model=PredictResponse)
def predict_sentiment(payload: PredictRequest):
    review_text = payload.review.strip()
    if not review_text:
        raise HTTPException(status_code=400, detail="Review text cannot be empty.")
        
    try:
        # Preprocess input text using shared utility function
        cleaned_text = preprocess_text(review_text)
        
        # Transform text to TF-IDF features
        features = vectorizer.transform([cleaned_text])
        
        # Predict sentiment label
        prediction = model.predict(features)[0]  # "Positive", "Negative", or "Neutral"
        
        # Extract prediction confidence from probability distributions
        probabilities = model.predict_proba(features)[0]
        class_index = list(model.classes_).index(prediction)
        confidence = float(probabilities[class_index] * 100)
        
        return PredictResponse(
            sentiment=prediction,
            confidence=round(confidence, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction engine error: {str(e)}")
