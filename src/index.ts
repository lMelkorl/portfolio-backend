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
  'https://melkor-projects.onrender.com/',
  'https://portfolio-backend-rg5l.onrender.com',
  'https://api.allorigins.win'
];

app.use(cors({
  origin: function(origin, callback) {
    // origin undefined ise localhost/postman gibi araçlardan istek geliyor demektir
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin); // Debug için
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 saat
}));

// CORS Preflight için OPTIONS handler
app.options('*', cors());

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