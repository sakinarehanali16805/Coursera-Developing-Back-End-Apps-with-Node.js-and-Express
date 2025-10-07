const fs = require("fs");
const path = require("path");

const REVIEWS_FILE = path.join(__dirname, "reviews.json"); // File to persist reviews

let reviews = []; // Start empty - no hardcoded samples

// Function to load reviews from JSON file (on startup)
const loadReviews = () => {
  if (fs.existsSync(REVIEWS_FILE)) {
    try {
      const data = fs.readFileSync(REVIEWS_FILE, "utf8");
      reviews = JSON.parse(data);
      console.log(`Loaded ${reviews.length} reviews from ${REVIEWS_FILE}`);
    } catch (error) {
      console.error("Error loading reviews:", error.message);
      reviews = []; // Fallback to empty
    }
  } else {
    console.log("No reviews file found; starting with empty array");
  }
};

// Function to save reviews to JSON file (after add/modify/delete)
const saveReviews = () => {
  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
    console.log(`Saved ${reviews.length} reviews to ${REVIEWS_FILE}`);
  } catch (error) {
    console.error("Error saving reviews:", error.message);
  }
};

// Load reviews on module initialization (runs after empty init)
loadReviews();

// Export the array and save function
module.exports = { reviews, saveReviews };
