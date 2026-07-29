import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getDb } from './config/database.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static food upload images
app.use('/uploads', express.static(uploadsDir));

// Allow all origins in production (Vercel, custom domains) + localhost dev
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps)
    if (!origin) return callback(null, true);
    // Allow localhost dev ports
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    // Allow all vercel.app domains
    if (origin.endsWith('.vercel.app') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    // Allow all for now - can be restricted later with specific domain
    return callback(null, true);
  },
  credentials: true
}));

// Express JSON body parser
app.use(express.json({ limit: '10mb' }));

// Initialize DB on server start
getDb()
  .then(() => {
    console.log('⚡ Connected to SQLite Database (FoodBridge)');
  })
  .catch((err) => {
    console.error('❌ Failed to initialize SQLite Database:', err);
  });

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'FoodBridge API Server',
    message: 'FoodBridge Platform Backend Server is Operational',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Centralized error handler
app.use(errorHandler);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 FoodBridge Server running on http://localhost:${PORT}`);
});
