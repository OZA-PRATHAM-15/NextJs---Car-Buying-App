const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  socket.on("registerUser", (email) => {
    userSocketMap[email] = socket.id;
  });

  socket.on("sendMessage", (data) => {
    const { receiver } = data;
    const receiverSocketId = userSocketMap[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", data);
    }
  });

  socket.on("disconnect", () => {
    for (const [email, id] of Object.entries(userSocketMap)) {
      if (id === socket.id) {
        delete userSocketMap[email];
        break;
      }
    }
  });
  socket.on("userTyping", ({ sender, receiver, senderName }) => {
    const receiverSocketId = userSocketMap[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { sender, senderName });
    }
  });

  socket.on("stopTyping", ({ sender, receiver }) => {
    const receiverSocketId = userSocketMap[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { sender });
    }
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/cars", require("./routes/carRoutes"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/chat", require("./routes/chat"));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
