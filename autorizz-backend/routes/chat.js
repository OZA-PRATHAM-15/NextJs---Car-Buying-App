const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage'); // Ensure the model is correctly imported
const User = require('../models/User');
const { authenticateUser } = require('../middlewares/authenticateUser');
const axios = require("axios");
//const { authenticateUser } = require('./auth');


// Send a message
router.post('/send', async (req, res) => {
    try {
        const { sender, receiver, message, type } = req.body;

        // Validate the required fields
        if (!sender || !receiver || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new message object
        const newMessage = new ChatMessage({
            sender: sender.email || sender, // Use email or ensure sender is a string
            receiver: receiver.email || receiver, // Use email or ensure receiver is a string
            message,
            type,
        });
        // Save the message to the database
        await newMessage.save();

        // Respond with success
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});


// Fetch chat history
router.get('/history', async (req, res) => {
    try {
        const { sender, receiver, page = 1, limit = 20 } = req.query;

        // Fetch messages between sender and receiver
        const messages = await ChatMessage.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        })
            .sort({ timestamp: 1 }) // Sort by timestamp
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

// Mark messages as read
router.post('/mark-read', async (req, res) => {
    try {
        const { sender, receiver } = req.body;

        // Update message status to 'read'
        await ChatMessage.updateMany(
            { sender, receiver, status: 'sent' },
            { $set: { status: 'read' } }
        );

        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: 'Failed to update message status' });
    }
});
router.get('/contacts', async (req, res) => {
    try {
        const { userId } = req.query;

        // Fetch agents and admins
        const contacts = await User.find({ role: { $in: ['Admin', 'Agent'] } });

        // Fetch bot details
        let bot = null;
        try {
            const botResponse = await axios.post('http://127.0.0.1:5000/bot-api/webhook', {
                action: "getBotDetails", // Example payload, update based on the bot's API requirements
            });
            bot = botResponse.data; // Ensure this matches the expected format
        } catch (botError) {
            console.error("Error fetching bot details:", botError.message);
            bot = { _id: 'bot', name: 'Admin Bot', role: 'bot' }; // Default bot fallback
        }

        res.status(200).json([bot, ...contacts]);
    } catch (error) {
        console.error('Error fetching contacts:', error.message);
        res.status(500).json({ message: 'Failed to fetch contacts' });
    }
});

router.get('/current-user', authenticateUser, (req, res) => {
    //console.log("User from middleware:", req.user); // Log user from middleware
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = {
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
    };
    res.json(user);
});

// Example of another protected route
router.get('/secure-chat', authenticateUser, (req, res) => {
    res.json({ message: 'This is a protected chat route', user: req.user });
});


module.exports = router;
