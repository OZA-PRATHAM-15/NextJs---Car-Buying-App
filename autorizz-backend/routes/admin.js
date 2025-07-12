const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_hardcoded_jwt_secret_key";

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "Admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

router.post("/add-agent", verifyAdmin, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let agent = await User.findOne({ email });
    if (agent) {
      return res.status(400).json({ error: "Agent already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    agent = new User({ name, email, password: hashedPassword, role: "Agent" });
    await agent.save();

    res.status(201).json({ message: "Agent added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/agents", async (req, res) => {
  try {
    const agents = await User.find({ role: "Agent" });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});
router.delete("/agents/:id", async (req, res) => {
  try {
    const agentId = req.params.id;
    await User.findByIdAndDelete(agentId);
    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete agent" });
  }
});
router.get("/users", async (req, res) => {
  try {
    const agents = await User.find({ role: "User" });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
