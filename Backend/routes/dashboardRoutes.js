const express = require('express');
const router = express.Router();

// 1. Use 'require' to import the controller function
const { getDashboardStats } = require('../controllers/dashboardController.js');

// 2. Use 'require' to import the middleware
const authMiddleware = require('../middlewares/authMiddleware.js');

// 3. Define the route
router.get('/stats', authMiddleware, getDashboardStats);

// 4. Use 'module.exports' to export the router
module.exports = router;
