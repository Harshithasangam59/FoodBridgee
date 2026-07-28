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

const router = express.Router();

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
