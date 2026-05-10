const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { authMiddleware } = require('./auth');

// Get all team members
router.get('/', async (req, res) => {
  try {
    const team = await Team.find().sort({ order: 1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new team member (Protected)
router.post('/', authMiddleware, async (req, res) => {
  const { name, role, image, order, isFounder } = req.body;
  const member = new Team({ name, role, image, order, isFounder });
  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update team member (Protected)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete team member (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
