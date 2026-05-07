# Deploying Backend to Render

Follow these steps to deploy your FastAPI backend to Render.com.

## Prerequisites

1.  Make sure your code is pushed to GitHub.
2.  Have your `GEMINI_API_KEY` ready.
3.  Sign up/Log in to [Render.com](https://render.com).

## Step-by-Step Guide

1.  **Create a New Web Service**
    *   Click "New +" -> "Web Service".
    *   Connect your GitHub repository.

2.  **Configure the Service**
    *   **Name**: `property-analyzer-backend` (or any unique name).
    *   **Root Directory**: `Backend` (This is very important since your `main.py` is inside `Backend/`).
    *   **Runtime**: `Python 3`.
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`

3.  **Add Environment Variables**
    *   Scroll down to the "Environment Variables" section.
    *   Add a key: `GEMINI_API_KEY`
    *   Value: (Paste your actual API key here)

4.  **Deploy**
    *   Click "Create Web Service".
    *   Wait for the deployment to finish.
    *   Once deployed, you will see a URL like `https://property-analyzer-backend.onrender.com`.

## Updating Frontend

After deployment, update your Frontend `.env` (or hardcoded URL) to point to the new backend URL instead of `http://localhost:8000`.

Example `.env` in Frontend:
```
VITE_API_URL=https://your-backend-url.onrender.com
```
