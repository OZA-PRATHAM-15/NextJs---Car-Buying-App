const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { authenticateUser } = require("../middlewares/authenticateUser");

const JWT_SECRET = process.env.JWT_SECRET || "your_hardcoded_jwt_secret_key";

const roleCheck = (role) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== role) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have the correct role" });
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

router.post("/register", async (req, res) => {
  const { name, email, password, role = "User" } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        error: "Email not verified. Please verify your email to proceed.",
      });
    }

    if (!user.role) {
      return res
        .status(400)
        .json({ error: "User does not have a role assigned" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      {
        expiresIn: "20h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const { userId, email, name } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      name: name || user.name,
      email: email || user.email,
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      dateOfBirth: user.dateOfBirth || "",
      gender: user.gender || "",
    });
  } catch (error) {
    console.error("Error in /profile route:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, phoneNumber, address, dateOfBirth, gender } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        name,
        phoneNumber,
        address,
        dateOfBirth,
        gender,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.delete("/delete-account", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await User.findByIdAndDelete(decoded.userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
});

router.get("/admin-only", roleCheck("Admin"), (req, res) => {
  res.status(200).json({ message: "Welcome Admin" });
});
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/generate-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts += 1;

    if (user.otpAttempts > 5) {
      return res
        .status(429)
        .json({ error: "OTP request limit exceeded. Try again later." });
    }

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating OTP" });
  }
});
router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findOne({ otp });
    if (!user) {
      return res.status(404).json({ error: "Invalid OTP" });
    }
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    await user.save();
    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = {
  authenticateUser,
  roleCheck,
};
module.exports = router;
