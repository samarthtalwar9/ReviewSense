import re
import nltk
from nltk.corpus import stopwords

# Quietly download standard NLTK stopwords resource package if missing
try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    nltk.download("stopwords", quiet=True)

STOP_WORDS = set(stopwords.words("english"))

def preprocess_text(text: str) -> str:
    """
    Cleans raw review text using NLP techniques:
    - Lowercase conversion
    - Special characters & punctuation scrubbing
    - NLTK English stopword removal
    - Extra spacing compression
    """
    if not text:
        return ""
    
    # 1. Lowercase conversion
    text = text.lower()
    
    # 2. Punctuation cleaning & alphabetic matching
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    
    # 3. Tokenize words
    words = text.split()
    
    # 4. Stopword removal using NLTK stopwords dictionary
    filtered_words = [word for word in words if word not in STOP_WORDS]
    
    # 5. Rejoin and trim excessive whitespace
    return " ".join(filtered_words).strip()
