const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { authMiddleware } = require('./auth');

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add testimonial (Protected)
router.post('/', authMiddleware, async (req, res) => {
  const testimonial = new Testimonial(req.body);
  try {
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete testimonial (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted testimonial' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
