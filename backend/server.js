const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/images', require('./routes/images'));
app.use('/api/config', require('./routes/config'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/team', require('./routes/team'));

// Default route
app.get('/', (req, res) => {
  res.send('EDTXME API is running...');
});

// Database Connection
if (process.env.MONGO_URI && process.env.MONGO_URI !== 'your_mongodb_connection_string') {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));
} else {
  console.log('No valid MONGO_URI provided. Skipping DB connection (for testing only).');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
