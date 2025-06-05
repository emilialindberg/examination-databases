import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

// Register new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Användarnamn eller email är redan taget' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Användare skapad' });
  } catch (err) {
    res.status(500).json({ message: 'Fel vid registrering', error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Fel email eller lösenord' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Fel email eller lösenord' });
    }

    // Create payload with userdata
    const payload = {
      userId: user._id,
      username: user.username,
      role: user.role
    };

    // Sign token with secret
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    // Send token back to user
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Fel vid inloggning', error: err.message });
  }
});

export default router;