import express from 'express';
import { Project } from '../types';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Burada projeleri getirme mantığınızı ekleyin
    const projects: Project[] = []; // Boş array'in tipini belirttik
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 