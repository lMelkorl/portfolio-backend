import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Burada projeleri getirme mantığınızı ekleyin
    const projects = []; // Örnek veri
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 