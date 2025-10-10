import express from 'express';
import { getAdherenceStats } from '../controllers/dashboardController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get medication adherence statistics for the last 7 days
// @access  Private
router.get('/stats', authMiddleware, getAdherenceStats);

export default router;
