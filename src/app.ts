import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import projectsRouter from './routes/projects';

const app = express();

// Middleware
app.use(express.json());

// CORS ayarları
const allowedOrigins = [
  'http://localhost:5173',
  'https://melkor-projects.onrender.com',
  'https://portfolio-backend-rg5l.onrender.com'
];

// Pre-flight istekleri için OPTIONS metodunu etkinleştir
app.options('*', cors());

app.use(cors({
  origin: allowedOrigins,  // Direkt array olarak kullan
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 