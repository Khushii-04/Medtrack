const express = require('express');
const router = express.Router();

// The names in {} MUST now match your controller's export names: 'register' and 'login'
const { 
    register,
    login 
} = require('../controllers/authController');

const { 
    signupValidation,
    loginValidation 
} = require('../middlewares/authValidation');

// Note: The route is '/signup', but it uses your 'register' function. This is perfectly fine.
router.post('/signup', signupValidation, register);

// The route is '/login', and it uses your 'login' function.
router.post('/login', loginValidation, login);

module.exports = router;