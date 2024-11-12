const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming we have a User model
const router = express.Router();

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

module.exports = router;
