import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SITARA Backend is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server!' });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('SITARA Backend API (RT-Prioritas) is running!');
});

app.listen(Number(ENV.PORT), '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${ENV.PORT}`);
});
