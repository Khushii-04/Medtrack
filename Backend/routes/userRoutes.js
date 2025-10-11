const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

router.get('/profile/:userId', authMiddleware, getProfile);
router.put('/profile/:userId', authMiddleware, updateProfile);

module.exports = router;