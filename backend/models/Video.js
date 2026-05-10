const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  col1_1: {
    type: String,
    required: true
  },
  col1_2: {
    type: String,
    required: true
  },
  col2: {
    type: String,
    required: true
  },
  driveFileId: {
    type: String,
    required: true
  },
  streamUrl: {
    type: String,
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  isReel: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);
