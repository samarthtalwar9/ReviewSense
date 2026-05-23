import os
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from utils import preprocess_text

def train_sentiment_model():
    print("Starting sentiment analysis model training pipeline...")
    
    # Define file paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "dataset", "reviews.csv")
    model_path = os.path.join(current_dir, "model.pkl")
    vectorizer_path = os.path.join(current_dir, "vectorizer.pkl")
    
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at: {dataset_path}")
        
    # 1. Load dataset
    df = pd.read_csv(dataset_path)
    print(f"Loaded dataset with {len(df)} samples.")
    
    # 2. Preprocess text data
    print("Preprocessing text data...")
    df["clean_review"] = df["review"].apply(preprocess_text)
    
    # 3. Vectorize text using TF-IDF
    print("Fitting TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
    X = vectorizer.fit_transform(df["clean_review"])
    y = df["sentiment"]
    
    # 4. Train Logistic Regression Classifier
    print("Training Logistic Regression classifier...")
    # Using low C (regularization) or default, and multi_class='multinomial' for Positive, Negative, Neutral
    model = LogisticRegression(C=1.0, max_iter=200, random_state=42)
    model.fit(X, y)
    
    # Evaluate on training data (just for logging)
    train_accuracy = model.score(X, y)
    print(f"Training accuracy: {train_accuracy * 100:.2f}%")
    
    # 5. Save model and vectorizer to disk
    print(f"Saving models...")
    with open(model_path, "wb") as m_file:
        pickle.dump(model, m_file)
        
    with open(vectorizer_path, "wb") as v_file:
        pickle.dump(vectorizer, v_file)
        
    print("Training completed successfully! Saved model.pkl and vectorizer.pkl.")

if __name__ == "__main__":
    train_sentiment_model()
