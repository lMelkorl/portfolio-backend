import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects';
import visitorLogsRoutes from './routes/visitorLogs';
import addOrderToProjects from './migrations/addOrderToProjects';
import authRouter from './routes/auth';

dotenv.config();

const app = express();

// CORS ayarları
app.use(cors({
  origin: ['http://localhost:5173', 'https://melkor-projects.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/visitor-logs', visitorLogsRoutes);
app.use('/api/auth', authRouter);

// Debug için tüm route'ları listele
app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.log(`Route: ${r.route.path}`);
    console.log(`Methods:`, r.route.methods);
  }
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something broke!',
    error: err.message
  });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  console.log(`404 - Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: https://portfolio-backend-rg5l.onrender.com/api`);
  
  try {
    await addOrderToProjects();
    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}); 