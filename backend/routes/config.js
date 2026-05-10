const express = require('express');
const router = express.Router();
const Config = require('../models/Config');

// Get all config or specific key
router.get('/', async (req, res) => {
  try {
    const configs = await Config.find();
    const configMap = {};
    configs.forEach(c => {
      configMap[c.key] = c.value;
    });
    res.json(configMap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update or Create config
router.post('/', async (req, res) => {
  const { key, value } = req.body;
  try {
    let config = await Config.findOne({ key });
    if (config) {
      config.value = value;
    } else {
      config = new Config({ key, value });
    }
    await config.save();
    res.json(config);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
