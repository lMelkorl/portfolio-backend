import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

// Routes
app.use('/api/auth', authRouter);

// Port tanımı
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 