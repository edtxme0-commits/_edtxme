# EDTXME - Cinematic Portfolio Platform

A premium cinematic portfolio platform for video editors. Built with React, TailwindCSS, GSAP, Node.js, Express, and Google Drive API.

## Project Structure
- `/frontend` - React + Vite frontend
- `/backend` - Node.js + Express backend

## Local Development

### 1. Setup Backend
```bash
cd backend
npm install
# Rename .env.example to .env and fill in your details
npm run dev # Starts on port 5000
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev # Starts on Vite default port (e.g., 5173)
```

## Google Drive API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the **Google Drive API** in the API Library.
4. Go to **Credentials** -> Create Credentials -> **Service Account**.
5. Give it a name and create.
6. Click on the created service account -> **Keys** -> Add Key -> Create new key (**JSON**).
7. Open the downloaded JSON file. You will need the `client_email` and `private_key`.
8. Create a folder in your personal Google Drive where videos will be uploaded.
9. **IMPORTANT**: Share this folder with the `client_email` address from the JSON file, and give it "Editor" access.
10. Get the Folder ID from the URL of your Google Drive folder (e.g., `https://drive.google.com/drive/folders/[FOLDER_ID]`).
11. Add these details to your `backend/.env` file.

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub.
2. Go to Vercel, import the repository.
3. Set the Root Directory to `frontend`.
4. Deploy.

### Backend (Render)
1. Go to Render.com and create a new Web Service.
2. Connect your GitHub repository.
3. Set Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all the Environment Variables from your `.env` file into Render's Environment section.
7. Deploy.
