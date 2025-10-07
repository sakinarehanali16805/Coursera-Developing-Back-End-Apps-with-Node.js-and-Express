const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "users.json"); // File to persist users

let users = []; // In-memory array

// Function to load users from JSON file (on startup)
const loadUsers = () => {
  if (fs.existsSync(USERS_FILE)) {
    try {
      const data = fs.readFileSync(USERS_FILE, "utf8");
      users = JSON.parse(data);
      console.log(`Loaded ${users.length} users from ${USERS_FILE}`);
    } catch (error) {
      console.error("Error loading users:", error.message);
      users = []; // Fallback to empty
    }
  } else {
    console.log("No users file found; starting with empty array");
  }
};

// Function to save users to JSON file (after registration)
const saveUsers = () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
    console.log(`Saved ${users.length} users to ${USERS_FILE}`);
  } catch (error) {
    console.error("Error saving users:", error.message);
  }
};

// Load users on module initialization (when server starts)
loadUsers();

// Export the array and save function
module.exports = { users, saveUsers };
