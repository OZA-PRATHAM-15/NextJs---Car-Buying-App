const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // Required for socket.io integration
const { Server } = require('socket.io'); // Import socket.io

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('MongoDB connection error:', error));

// Create HTTP server for socket.io
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now, can be restricted to your frontend domain
        methods: ["GET", "POST"],
    },
});

// Real-time chat logic with socket.io
io.on('connection', (socket) => {
    //console.log('New client connected:', socket.id);

    // Listen for chat messages
    socket.on('sendMessage', (data) => {
        //console.log('Message received:', data);

        // Broadcast message to all connected clients
        const { sender, receiver, message, type } = data;
        socket.to(receiver).emit('receiveMessage', { sender, receiver, message, type });

    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        //console.log('Client disconnected:', socket.id);
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/chat', require('./routes/chat')); // Chat routes include /contacts

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
