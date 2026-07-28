import express from 'express';
import { getImpactMetrics } from '../controllers/impactController.js';

const router = express.Router();

// Impact metrics - public route
router.get('/metrics', getImpactMetrics);

export default router;
