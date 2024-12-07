const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming we have a User model
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// JWT_SECRET: Fetch it from environment or fallback (but better to use only env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_hardcoded_jwt_secret_key';

// Register route
router.post('/register', async (req, res) => {
    const { name, email, password, role = 'User' } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        if (!user.isVerified) {
            return res.status(403).json({ error: 'Email not verified. Please verify your email to proceed.' });
        }

        // Check if user has a role (ensure your database has a role field for users)
        if (!user.role) {
            return res.status(400).json({ error: 'User does not have a role assigned' });
        }

        // Create and send JWT token with role included
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Profile route
router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    //console.log('Received token on backend:', token); // Log the received token

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // console.log('Decoded token:', decoded); // Log the decoded token

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
            dateOfBirth: user.dateOfBirth || '',
            gender: user.gender || ''
        });
    } catch (error) {
        console.error('Error verifying token:', error.message); // Log the error
        return res.status(403).json({ error: 'Invalid token' });
    }
});

router.put('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { name, phoneNumber, address, dateOfBirth, gender } = req.body;

        // Find the user and update their profile
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            {
                name,
                phoneNumber,
                address,
                dateOfBirth,
                gender
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/delete-account', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        await User.findByIdAndDelete(decoded.userId);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(403).json({ error: 'Invalid token' });
    }
});


const roleCheck = (role) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== role) {
            return res.status(403).json({ error: 'Forbidden: You do not have the correct role' });
        }
        next(); // User has the correct role
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Example of applying roleCheck to protect Admin-only routes
router.get('/admin-only', roleCheck('Admin'), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin' });
});
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider (e.g., Gmail, Outlook, etc.)
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
    },
});

router.post('/generate-otp', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set OTP and expiration time (10 minutes from now)
        user.otp = otp;
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        user.otpAttempts += 1;

        // Check OTP attempts limit
        if (user.otpAttempts > 5) {
            return res.status(429).json({ error: 'OTP request limit exceeded. Try again later.' });
        }

        await user.save();

        // Send OTP to user's email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Verification Code',
            text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
        });

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating OTP' });
    }
});
router.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
    try {
        // Find the user with the provided OTP
        const user = await User.findOne({ otp });
        if (!user) {
            return res.status(404).json({ error: 'Invalid OTP' });
        }
        // Check if OTP has expired
        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({ error: 'OTP has expired' });
        }
        // Mark the user as verified
        user.isVerified = true;
        user.otp = null; // Clear the OTP
        user.otpExpiresAt = null; // Clear the expiration
        user.otpAttempts = 0; // Reset OTP attempts
        await user.save();
        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;
