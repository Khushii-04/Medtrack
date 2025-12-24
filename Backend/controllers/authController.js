const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../util/generateOTP");
const { sendEmail } = require("../util/sendEmail");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP logic
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      emailOTP: hashedOTP,
      emailOTPExpiry: Date.now() + 10 * 60 * 1000, // 10 mins
      emailOTPAttempts: 0,
    });

    await sendEmail(email, otp);

    res.status(201).json({
      message: "Signup successful. OTP sent to email for verification.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= VERIFY EMAIL ================= */
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified)
      return res.status(400).json({ message: "Email already verified" });

    if (user.emailOTPAttempts >= 5)
      return res.status(429).json({
        message: "Too many attempts. Please resend OTP.",
      });

    if (user.emailOTPExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const isOtpValid = await bcrypt.compare(otp, user.emailOTP);
    if (!isOtpValid) {
      user.emailOTPAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;
    user.emailOTPAttempts = 0;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= RESEND OTP ================= */
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified)
      return res.status(400).json({ message: "Email already verified" });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.emailOTP = hashedOTP;
    user.emailOTPExpiry = Date.now() + 10 * 60 * 1000;
    user.emailOTPAttempts = 0;

    await user.save();
    await sendEmail(email, otp);

    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.isEmailVerified)
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
