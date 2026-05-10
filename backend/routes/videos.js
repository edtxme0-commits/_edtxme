const express = require('express');
const router = express.Router();
const multer = require('multer');
const { google } = require('googleapis');
const stream = require('stream');
const { authMiddleware } = require('./auth');
const Video = require('../models/Video');

const os = require('os');
const fs = require('fs');

// Configure Multer for disk storage to prevent OOM errors on Render
const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// Configure Google Drive API
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

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching videos', error: err.message });
  }
});

// POST Increment View
router.post('/:id/view', async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error tracking view' });
  }
});

// PATCH update video (Admin only)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Error updating video' });
  }
});

// POST new video (Admin only)
router.post('/upload', authMiddleware, upload.single('video'), async (req, res) => {
  try {
    const { title, category, col1_1, col1_2, col2, isFeatured, isReel } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No video file provided' });

    const driveService = getDriveService();
    if (!driveService) return res.status(500).json({ message: 'Google Drive integration not configured' });

    const driveRes = await driveService.files.create({
      requestBody: {
        name: `${title} - ${Date.now()}`,
        mimeType: file.mimetype,
        parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : [],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
      fields: 'id',
    });

    // Cleanup temp file
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      console.error('Temp file cleanup failed:', e);
    }

    const fileId = driveRes.data.id;
    await driveService.permissions.create({
      fileId: fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    const newVideo = new Video({
      title,
      category,
      col1_1,
      col1_2,
      col2,
      isFeatured: isFeatured === 'true',
      isReel: isReel === 'true',
      driveFileId: fileId,
      streamUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
    });

    await newVideo.save();
    res.status(201).json({ message: 'Upload successful', video: newVideo });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading video', error: err.message });
  }
});

// DELETE video (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const driveService = getDriveService();
    if (driveService) {
      try {
        await driveService.files.delete({ fileId: video.driveFileId });
      } catch (driveErr) {}
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting video', error: err.message });
  }
});

module.exports = router;
