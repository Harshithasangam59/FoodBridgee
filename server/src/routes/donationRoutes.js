import express from 'express';
import {
  createDonation,
  getAvailableDonations,
  getMyDonations,
  reserveDonation,
  markCollected,
  getNgoDashboard,
  getCsrReport
} from '../controllers/donationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'food-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const router = express.Router();

// Upload image route
router.post('/upload', protect, authorizeRoles('donor'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  return res.status(200).json({ success: true, imageUrl });
});

// Available donations - public route (no auth required)
router.get('/available', getAvailableDonations);

// NGO specific dashboard overview
router.get('/ngo-dashboard', protect, authorizeRoles('ngo'), getNgoDashboard);

// Donor specific routes
router.post('/', protect, authorizeRoles('donor'), createDonation);
router.get('/my-donations', protect, authorizeRoles('donor'), getMyDonations);
router.get('/csr-report', protect, authorizeRoles('donor'), getCsrReport);

// Shared / Role protected action routes
router.post('/:id/reserve', protect, authorizeRoles('ngo'), reserveDonation);
router.post('/:id/collect', protect, markCollected);

export default router;
