// routes/doseRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Import controller functions
const {
    logDose,
    getDoseStats
} = require('../controllers/doseController');

// Protect all routes in this file
router.use(authMiddleware);

// Define routes
router.post('/log', logDose);
router.get('/stats', getDoseStats);

module.exports = router;