# 🔮 ReviewSense — AI Sentiment Intelligence Dashboard

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Render Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Scikit-Learn](https://img.shields.io/badge/scikit_learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)

ReviewSense is a production-level, high-performance AI Sentiment Intelligence dashboard designed to analyze, track, and visualize customer review polarities in real-time. Built with a futuristic glassmorphic UI design system, it features a modular architecture separating a clean client-side dashboard from a FastAPI deep-learning prediction server.

---

## 🚀 Features

- **Futuristic Cinematic UI:** Implements custom glassmorphism design tokens, interactive ambient canvas particles, smooth SVG neon animations, and responsive dashboards.
- **Real-Time Sentiment Classification:** Predicts `Positive`, `Negative`, and `Neutral` sentiments with precision probability confidence metrics.
- **Dynamic Metrics Engine:** Live trackers indicating **Total Analyses**, **Positive Rate**, **Average Confidence**, and **Reviews Today** with zero state layouts.
- **Bezier Trend Charts:** Canvas-rendered weekly data charting curves showing sentiment distribution movements.
- **Local Persistence:** Retains full application states, analysis histories, and daily stats charts between page loads using `localStorage`.
- **Flexible Cross-Origin Operations:** Built-in CORS routing on the backend API allowing multi-domain web communication (e.g. Vercel frontend + Render backend).
- **Intelligent API Config Resolver:** Automatically switches between dev localhost endpoints and deployed cloud hosts depending on the environment.
- **Robust Exception Handling:** Integrated `AbortController` request timeout monitoring (8s limit) and detailed network exception visual alerts.

---

## 🛠️ Tech Stack

### Frontend
- **Structure:** Semantic HTML5
- **Styling:** Custom Vanilla CSS3 (Custom Variables, Keyframe Animations, Glassmorphism Filters)
- **Logic:** Vanilla ES6+ JavaScript (HTML5 Canvas Engine, Fetch API, LocalStorage Interface, AbortController)

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **ML / Data Science:** Scikit-Learn (TF-IDF Vectorization, Logistic Regression Classifier), Pandas, NumPy
- **Server Gateway:** Uvicorn / Gunicorn

---

## 📂 Folder Structure

```text
ReviewSense/
│
├── frontend/
│   ├── index.html          # Main dashboard structural shell
│   ├── style.css           # Cinematic CSS design tokens & animations
│   ├── script.js            # Core interactive logic and API connectors
│   │
│   ├── assets/             # Media and styling resources
│   │   ├── icons/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── animations/
│   │
│   └── components/         # Placeholder for future modular JS structures
│
├── backend/
│   ├── app.py              # FastAPI server endpoints & CORS policies
│   ├── train_model.py      # ML Model training and serialization script
│   ├── utils.py            # Preprocessing text utility functions
│   ├── model.pkl           # Serialized Logistic Regression model pickle
│   ├── vectorizer.pkl      # Serialized TF-IDF Vectorizer pickle
│   ├── requirements.txt    # Python packages list
│   ├── Procfile            # Cloud hosting server command configuration
│   │
│   └── dataset/
│       └── reviews.csv     # Training dataset of labeled customer reviews
│
├── README.md               # Project documentation
├── .gitignore              # Repository file exclusion rules
└── LICENSE                 # Open-source MIT License
```

---

## 🔧 Installation & Local Setup

### Prerequisite
Ensure you have **Python 3.9+** and a modern web browser installed.

---

### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   * **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **(Optional) Retrain the Machine Learning model:**
   You can run the pipeline to process the CSV dataset and rebuild `model.pkl` and `vectorizer.pkl`:
   ```bash
   python train_model.py
   ```

5. **Start the FastAPI local development server:**
   ```bash
   uvicorn app:app --reload --host 127.0.0.1 --port 8000
   ```
   The backend API will run at `http://127.0.0.1:8000`. You can inspect the interactive OpenAPI documentation at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup

1. Open a new terminal session or navigate to the frontend folder.
2. Since the frontend is composed of native HTML/CSS/JS, you do not need to install packages or compile assets.
3. Open `frontend/index.html` directly in your browser or run a simple local web server:
   * **Python SimpleServer:**
     ```bash
     cd frontend
     python -m http.server 3000
     ```
     Access the dashboard at `http://localhost:3000`.

---

## 🌐 API Endpoint Usage

### Predict Sentiment
- **Method:** `POST`
- **Path:** `/predict`
- **Headers:** `Content-Type: application/json`
- **Request Payload:**
  ```json
  {
    "review": "I absolutely love using this new software! It is fast and responsive."
  }
  ```
- **Response Format:**
  ```json
  {
    "sentiment": "Positive",
    "confidence": 98.42
  }
  ```

---

## ☁️ Deployment Guide

### Frontend (Vercel)
1. Install the Vercel CLI or link your GitHub repository to [Vercel](https://vercel.com).
2. Configure the **Build & Development Settings**:
   - **Framework Preset:** `Other` (Static HTML site)
   - **Root Directory:** `frontend/`
3. If deploying the backend separately, you can override the target endpoint by adding the backend's Render/cloud URL to `localStorage` under `reviewsense_api_url` in your browser console:
   ```javascript
   localStorage.setItem('reviewsense_api_url', 'https://your-backend-service.onrender.com/predict');
   ```

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure the environment variables:
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app`
   - **Root Directory:** `backend/`

---

## 🔮 Future Improvements

- **Interactive API Endpoint Setter:** Add a settings modal inside the dashboard to let users paste their backend URL directly from the interface.
- **Deep Language Models:** Port the model pipeline to use transformer models (e.g. HuggingFace DistilBERT) for nuanced context understanding.
- **Database Integration:** Connect reviews history to PostgreSQL or MongoDB for multi-user session storage.
- **Bulk CSV Uploads:** Enable users to import csv batches of comments and output a unified sentiment analytics report.

---

## 💳 Credits

Developed by **Samarth Talwar**.

---

<p align="center">
  <b>Project by Samarth Talwar</b>
</p>