# 🚀 Complete Deployment Guide: EDTXME Cinematic Portfolio

Follow these steps exactly to deploy your premium cinematic portfolio. We will use **MongoDB Atlas** for the database, **Render** for the backend, and **Vercel** for the frontend.

---

## 🛠️ Step 1: Secure Your Code (.gitignore)
Before pushing anything to GitHub, ensure your sensitive files are ignored. I have already created `.gitignore` files in:
- Root directory (`/`)
- Backend directory (`/backend/`)
- Frontend directory (`/frontend/`)

**Files that will NEVER be uploaded to GitHub:**
- `node_modules/` (Too large)
- `.env` (Contains your secret passwords and API keys)
- `dist/` or `build/` (Compiled code)

---

## 🍃 Step 2: Database Setup (MongoDB Atlas)
1. **Sign Up:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. **Create Cluster:** Choose the "M0" (FREE) cluster. Pick a region near you.
3. **Database Access:** 
   - Create a user (e.g., `shaurya`).
   - Copy the password safely.
4. **Network Access:** 
   - Click "Add IP Address".
   - Click "Allow Access From Anywhere" (0.0.0.0/0). *This is required for Render.*
5. **Connection String:**
   - Click **Connect** -> **Drivers**.
   - Copy the `mongodb+srv://...` string. Replace `<password>` with your actual password.
   - **Keep this string ready for Step 4.**

---

## 🐙 Step 3: Push to GitHub
1. Create a **Private** repository on [GitHub](https://github.com/new) named `edtxme`.
2. Open your terminal in the root folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial cinematic build"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/edtxme.git
   git push -u origin main
   ```

---

## ⚙️ Step 4: Backend Deployment (Render.com)
1. **Sign Up:** Go to [Render.com](https://render.com/) and connect your GitHub.
2. **New Web Service:**
   - Click **New +** -> **Web Service**.
   - Select your `edtxme` repository.
3. **Configuration:**
   - **Name:** `edtxme-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. **Environment Variables:** Click "Advanced" -> "Add Environment Variable":
   | Key | Value |
   | :--- | :--- |
   | `PORT` | `5000` |
   | `MONGO_URI` | *Your MongoDB String from Step 2* |
   | `JWT_SECRET` | *Any random text (e.g., edtxme_secret_2024)* |
   | `ADMIN_USER` | *Your chosen username (e.g., edtxme)* |
   | `ADMIN_PASS` | *Your chosen password to login to /admin* |
   | `GOOGLE_CLIENT_ID` | *Your Google Cloud ID* |
   | `GOOGLE_CLIENT_SECRET` | *Your Google Cloud Secret* |
   | `GOOGLE_REFRESH_TOKEN` | *Your Google Refresh Token* |
   | `GOOGLE_DRIVE_FOLDER_ID` | *The folder ID where videos will be stored* |
5. **Deploy:** Click **Create Web Service**. Wait for the logs to say "Server running on port 5000".
6. **Copy URL:** Copy the URL (e.g., `https://edtxme-backend.onrender.com`).

---

## 🎨 Step 5: Frontend Deployment (Vercel)
1. **Sign Up:** Go to [Vercel.com](https://vercel.com/) and connect your GitHub.
2. **New Project:**
   - Select your `edtxme` repository.
3. **Configuration:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
4. **Environment Variables:**
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | *The Render URL from Step 4* |
5. **Deploy:** Click **Deploy**. Your site will be live at `edtxme.vercel.app` (or similar).

---

## 🔑 Step 6: Google API & Admin Sync
1. **Google Cloud:** Ensure your Google Cloud Project has the **Drive API** enabled and your Refresh Token is valid.
2. **First Login:**
   - Go to `https://your-site.vercel.app/admin`.
   - Login with the `ADMIN_USER` and `ADMIN_PASS` you set on Render.
3. **Sync Content & Team:**
   - Since the database is new, go to the **About & Team** tab.
   - Re-upload your main "About" images and "Founder" photos in the settings and click **Save Settings**.
   - Scroll down to **Team Management** and add any additional team members dynamically. This will populate the new team section on the site.

---

## ⚠️ Important Notes
- **Cold Starts:** Render's free tier "sleeps" after 15 mins of inactivity. When you first visit the site, the backend might take 30-40 seconds to wake up. This is normal for free hosting.
- **Updates:** Whenever you push code to GitHub (`git push`), Vercel and Render will automatically redeploy your site.

**Happy Cinematic Editing! 🎬✨**
