// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { handleChatMessage } = require('../controllers/chatController');

// Protect chat route with authentication
router.post('/', authMiddleware, handleChatMessage);

module.exports = router;