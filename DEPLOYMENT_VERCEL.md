# Vercel Deployment Guide

I have configured your project for deployment on Vercel. 

## Important: Read Before Deploying
Vercel is a **serverless** platform. This means:
1. **SQLite Database**: Any changes made to the database while the app is running will be **lost** when the server sleeps or restarts (usually after a few minutes of inactivity).
2. **File Uploads**: Images uploaded to the `uploads/` folder will also be **deleted** automatically.

**Recommendation**: For a permanent internship project, I suggest using **Render.com** (which supports persistent disks) or migrating the database to **Vercel Postgres** and images to **Cloudinary**.

---

## How to Deploy

### 1. Push to GitHub
Make sure all your local changes (including the new `vercel.json`) are pushed to your GitHub repository.

### 2. Connect to Vercel
1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **"Add New"** -> **"Project"**.
3. Import your GitHub repository.
4. **Project Settings**:
   - **Framework Preset**: Other (it will detect `vercel.json`).
   - **Root Directory**: `PSI_1_014_pruthvik_real-estate-property-analyzer-master` (or leave as `./` if you pushed only the contents of that folder).

### 3. Environment Variables
In the Vercel dashboard, go to **Settings** -> **Environment Variables** and add:
- `GEMINI_API_KEY`: Your Google Gemini API Key.

### 4. Deploy
Click **Deploy**. Vercel will:
- Build your Frontend (React/Vite).
- Set up your Backend (FastAPI) as a serverless function.
- Automatically route requests from the Frontend to the Backend.

---

## Local Testing
To test the production build locally before pushing, you can use the Vercel CLI:
```bash
npm install -g vercel
vercel dev
```
