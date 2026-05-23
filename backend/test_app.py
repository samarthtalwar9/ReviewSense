import sys
import os

# Insert backend directory into system path to allow local imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from fastapi.testclient import TestClient
    from app import app
except ImportError:
    print("FastAPI TestClient not available. Installing dependencies or skipping imports...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "httpx"])
    from fastapi.testclient import TestClient
    from app import app

client = TestClient(app)

def test_predict_positive():
    response = client.post("/predict", json={"review": "This is an amazing and fantastic product! Highly recommended."})
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert "confidence" in data
    assert data["sentiment"] in ["Positive", "Negative", "Neutral"]
    print("Positive Review Inference Test: Passed ->", data)

def test_predict_negative():
    response = client.post("/predict", json={"review": "Worst service ever, broken and useless. I waste my money."})
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert "confidence" in data
    assert data["sentiment"] in ["Positive", "Negative", "Neutral"]
    print("Negative Review Inference Test: Passed ->", data)

def test_predict_empty():
    response = client.post("/predict", json={"review": ""})
    # Should fail validation (HTTP 400 Bad Request)
    assert response.status_code == 400
    print("Empty Review Validation Test: Passed")

if __name__ == "__main__":
    print("Running automated backend prediction pipeline tests...")
    test_predict_positive()
    test_predict_negative()
    test_predict_empty()
    print("All backend unit tests executed successfully!")
