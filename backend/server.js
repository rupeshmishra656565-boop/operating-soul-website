require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to Operating Soul Database'))
  .catch((err) => console.log('Database connection error:', err));

// Airdrop API Route
app.post('/api/airdrop/register', async (req, res) => {
  try {
    const { email } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const newUser = new User({ email });
    await newUser.save();

    res.status(201).json({ message: 'Welcome to Operating Soul! Registration successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
