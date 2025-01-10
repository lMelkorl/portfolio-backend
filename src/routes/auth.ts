import express from 'express';
import cors from 'cors';
import { auth } from '../config/firebase';

const router = express.Router();

// CORS options
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
};

// CORS middleware'ini uygula
router.use(cors(corsOptions));

// Verify token endpoint
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    return res.json({ user: decodedToken });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;