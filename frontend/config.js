// ReviewSense — Client-side Environment Configuration
const Config = {
  // FastAPI Backend Endpoint. Replace this with your actual production domain
  // (e.g. "https://reviewsense-api.onrender.com/predict")
  API_BASE_URL: "http://127.0.0.1:8000/predict",
  
  // If set to true, when hosted on the web, requests will route relatively to "/predict"
  // Set to false if the frontend is hosted on Vercel and the backend is on Render.
  AUTO_RESOLVE_RELATIVE: false
};

window.ENV_CONFIG = Config;
