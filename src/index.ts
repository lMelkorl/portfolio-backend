import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects';
import addOrderToProjects from './migrations/addOrderToProjects';
import authRouter from './routes/auth';

dotenv.config();

const app = express();

// CORS ayarları
const allowedOrigins = [
  'http://localhost:5173',
  'https://melkor-projects.onrender.com',
  'https://melkor-projects.onrender.com/'
];

app.use(cors({
  origin: function(origin, callback) {
    // origin undefined ise localhost/postman gibi araçlardan istek geliyor demektir
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/auth', authRouter);

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