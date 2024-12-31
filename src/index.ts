import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects';
import addOrderToProjects from './migrations/addOrderToProjects';

dotenv.config();

const app = express();

// CORS ayarları
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5001;

// Sunucu başlatıldığında migration'ı çalıştır
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Migration'ı çalıştır
  await addOrderToProjects();
}); 