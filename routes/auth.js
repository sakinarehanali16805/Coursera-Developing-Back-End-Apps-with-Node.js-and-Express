const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { users, saveUsers } = require("../models/users");

const JWT_SECRET = "gdhqyUUIGHVhHSOIUQnajhsq";

// Task 6: Register new user
router.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Username and password are required" });
    }
    if (users.find((u) => u.username === username)) {
      return res
        .status(400)
        .json({ success: false, error: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
    };
    users.push(newUser);

    saveUsers(); // This creates/updates users.json with the new user

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      message: "User  registered successfully",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        password: newUser.password, // Hashed password
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Task 7: Login user
router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Username and password are required" });
    }
    const user = users.find((u) => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid username or password" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    saveUsers();

    res.json({
      success: true,
      message: "User  logged in successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        password: user.password, // Hashed password
      },
    });
  } catch (error) {
    console.error("Login error:", error.message); // Added log for debugging
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
