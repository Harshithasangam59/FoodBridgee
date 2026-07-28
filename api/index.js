// Vercel Serverless Function - FoodBridge API
// This wraps the Express app for Vercel's Node.js runtime

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();

// Allow all origins (Vercel + localhost)
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Dynamically import routes (handles Vercel's module resolution)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
const { default: authRoutes } = await import('../server/src/routes/authRoutes.js');
const { default: donationRoutes } = await import('../server/src/routes/donationRoutes.js');
const { default: impactRoutes } = await import('../server/src/routes/impactRoutes.js');
const { default: notificationRoutes } = await import('../server/src/routes/notificationRoutes.js');
const { default: aiRoutes } = await import('../server/src/routes/aiRoutes.js');
const { errorHandler } = await import('../server/src/middleware/errorHandler.js');
const { getDb } = await import('../server/src/config/database.js');

// Initialize DB
try {
  await getDb();
  console.log('✅ FoodBridge DB initialized on Vercel');
} catch (err) {
  console.error('⚠️ DB init warning:', err.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'FoodBridge API',
    env: process.env.VERCEL ? 'Vercel Production' : 'Local',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Error handler
app.use(errorHandler);

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

export default app;
