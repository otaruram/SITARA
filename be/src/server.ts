import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import routes from './routes';

const app = express();

// CORS Configuration with hardcoded domain sitara.biz.id
const allowedOrigins = [
  'https://sitara.biz.id',
  'https://www.sitara.biz.id',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.sitara.biz.id') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
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

// Health check endpoints (Lightweight ping targets for Render keep-alive)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server!' });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'SITARA Backend API (RT-Prioritas)',
    domain: 'sitara.biz.id',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.listen(Number(ENV.PORT), '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${ENV.PORT}`);
});
