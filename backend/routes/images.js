const express = require('express');
const router = express.Router();
const multer = require('multer');
const { google } = require('googleapis');
const stream = require('stream');
const { authMiddleware } = require('./auth');

const os = require('os');
const fs = require('fs');

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for images
});

const getDriveService = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    return null;
  }
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.drive({ version: 'v3', auth: oauth2Client });
};

router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No image file provided' });

    const driveService = getDriveService();
    if (!driveService) return res.status(500).json({ message: 'Google Drive integration not configured' });

    const driveRes = await driveService.files.create({
      requestBody: {
        name: `Asset-${Date.now()}`,
        mimeType: file.mimetype,
        parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : [],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
      fields: 'id',
    });

    try {
      fs.unlinkSync(file.path);
    } catch (e) {}

    const fileId = driveRes.data.id;
    await driveService.permissions.create({
      fileId: fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    res.json({ 
      url: `https://drive.google.com/uc?export=download&id=${fileId}`,
      fileId: fileId 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading image', error: err.message });
  }
});

module.exports = router;
