const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String, // "text", "image", "audio", etc.
        default: "text",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String, // "sent", "delivered", "read"
        default: "sent",
    },
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
