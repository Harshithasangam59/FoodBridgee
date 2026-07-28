import express from 'express';
import { getAIFreshness } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/freshness', protect, getAIFreshness);

export default router;
