import re

def preprocess_text(text: str) -> str:
    """
    Cleans and normalizes review text for sentiment analysis.
    Converts to lowercase, removes special characters/punctuation,
    and strips redundant whitespace.
    """
    if not text:
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove punctuation, numbers, and special characters (preserving spaces)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Normalize whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text
