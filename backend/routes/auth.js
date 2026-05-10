const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock Admin Credentials (In a real app, hash and store in DB)
const ADMIN_USER = process.env.ADMIN_USER || 'edtxme';
const ADMIN_PASS = process.env.ADMIN_PASS || 'Shubham@@5526';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'secret123', {
      expiresIn: '24h'
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = router;
module.exports.authMiddleware = authMiddleware;
