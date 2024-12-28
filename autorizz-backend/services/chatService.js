const ChatMessage = require('../models/ChatMessage');

async function getChatHistory(sender, receiver, page, limit) {
    return await ChatMessage.find({
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
        ],
    })
        .sort({ timestamp: 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
}

module.exports = { getChatHistory };
