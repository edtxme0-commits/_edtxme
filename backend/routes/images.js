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

    const proxyUrl = `/api/images/proxy/${fileId}`;
    res.json({ 
      url: proxyUrl,
      fileId: fileId 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading image', error: err.message });
  }
});

// Proxy route to completely bypass Google Drive hotlinking blocks
router.get('/proxy/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    // Create a fresh OAuth client just for the token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const tokenResponse = await oauth2Client.getAccessToken();
    const token = tokenResponse.token;
    
    if (!token) {
      throw new Error("Could not get access token");
    }

    const axios = require('axios');
    
    const requestHeaders = {
      Authorization: `Bearer ${token}`
    };
    
    if (req.headers.range) {
      requestHeaders.Range = req.headers.range;
    }

    const response = await axios({
      method: 'get',
      url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&acknowledgeAbuse=true`,
      headers: requestHeaders,
      responseType: 'stream',
      validateStatus: (status) => status >= 200 && status < 400
    });

    // Forward headers
    const headersToForward = ['content-type', 'content-length', 'content-range', 'accept-ranges'];
    headersToForward.forEach(h => {
      if (response.headers[h]) {
        res.setHeader(h, response.headers[h]);
      }
    });

    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.status(response.status);
    
    response.data.on('error', (err) => {
      console.error('Stream error during playback:', err.message);
      if (!res.headersSent) {
        res.status(500).end();
      } else {
        res.end();
      }
    });

    response.data.pipe(res);
  } catch (error) {
    console.error('Proxy Error for fileId', req.params.id, ':', error.message);
    if (!res.headersSent) {
      res.redirect(`https://drive.google.com/uc?export=download&confirm=t&id=${req.params.id}`); // Fallback
    } else {
      res.end();
    }
  }
});

module.exports = router;
