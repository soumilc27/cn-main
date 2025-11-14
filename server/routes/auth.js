import express from 'express';
import argon2 from 'argon2';
import speakeasy from 'speakeasy';
import User from '../models/User.js';

const router = express.Router();

// Helper function to generate MFA secret
const generateMFASecret = () => {
  return speakeasy.generateSecret({
    name: 'Password Manager',
    issuer: 'MyApp',
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Generate MFA secret
    const mfaSecret = generateMFASecret().base32;

    // Create user
    const user = new User({
      email,
      passwordHash,
      mfaSecret,
    });

    await user.save();

    // Return MFA secret for setup (in real app, show QR code)
    res.status(201).json({
      message: 'User registered successfully',
      mfaSecret: mfaSecret, // For QR code generation on frontend
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login (first step: check credentials)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await argon2.verify(user.passwordHash, password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Password correct, require MFA
    res.json({ message: 'Password verified, MFA required' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify MFA
router.post('/mfa/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Verify MFA code
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: 2, // Allow some time tolerance
    });

    if (!verified) {
      return res.status(401).json({ message: 'Invalid MFA code' });
    }

    // MFA verified, return a simple token (in production, use JWT)
    res.json({ message: 'MFA verified', token: 'simple-token-' + user._id });
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;