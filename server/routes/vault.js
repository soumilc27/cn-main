import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify token (simplified, in production use JWT)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !token.startsWith('simple-token-')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = token.replace('simple-token-', '');
  req.userId = userId;
  next();
};

// Get vault
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ vault: user.vault });
  } catch (error) {
    console.error('Get vault error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vault
router.put('/', verifyToken, async (req, res) => {
  try {
    const { vault } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { vault },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Vault updated successfully' });
  } catch (error) {
    console.error('Update vault error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;