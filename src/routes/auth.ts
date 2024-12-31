import express from 'express';
import { auth } from '../config/firebase';

const router = express.Router();

// Verify token endpoint (optional - for token validation).
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    return res.json({ user: decodedToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

export default router; 