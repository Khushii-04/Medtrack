const express = require('express');
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  resendOTP,
} = require("../controllers/authController");

const { 
    signupValidation,
    loginValidation 
} = require('../middlewares/authValidation');



router.post('/signup', signupValidation, register);
router.post('/login', loginValidation, login);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);

module.exports = router;