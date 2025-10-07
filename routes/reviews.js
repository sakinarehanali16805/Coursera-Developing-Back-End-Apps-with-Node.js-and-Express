const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { reviews, saveReviews } = require("../models/reviews");
const { users } = require("../models/users");

// Task 5: Get reviews for a book
router.get("/books/:bookId/reviews", (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    if (isNaN(bookId)) {
      return res.status(400).json({ success: false, error: "Invalid book ID" });
    }
    const bookReviews = reviews
      .filter((r) => r.bookId === bookId)
      .map((r) => ({
        id: r.id,
        bookId: r.bookId,
        reviewer: users.find((u) => u.id === r.userId)?.username || "Unknown",
        rating: r.rating,
        comment: r.comment,
      }));
    res.json({ success: true, data: bookReviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Task 8: Add a new review (Authenticated)
router.post("/books/:bookId/reviews", auth, (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const { comment, rating } = req.body;
    if (isNaN(bookId)) {
      return res.status(400).json({ success: false, error: "Invalid book ID" });
    }
    if (!comment || !rating) {
      return res
        .status(400)
        .json({ success: false, error: "Comment and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, error: "Rating must be between 1 and 5" });
    }
    const newReview = {
      id: reviews.length + 1,
      bookId,
      userId: req.user.id,
      comment,
      rating: parseInt(rating),
    };
    reviews.push(newReview);
    saveReviews();

    const reviewerName =
      users.find((u) => u.id === req.user.id)?.username || "Unknown";
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: {
        id: newReview.id,
        bookId: newReview.bookId,
        reviewer: reviewerName,
        rating: newReview.rating,
        comment: newReview.comment,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Task 8: Modify a review (Authenticated, own only)
router.put("/reviews/:reviewId", auth, (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId);
    const { comment, rating } = req.body;
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }
    if (review.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized: Can only modify your own reviews",
      });
    }
    if (comment) review.comment = comment;
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ success: false, error: "Rating must be between 1 and 5" });
      }
      review.rating = parseInt(rating);
    }
    saveReviews();

    const reviewerName =
      users.find((u) => u.id === req.user.id)?.username || "Unknown";
    res.json({
      success: true,
      message: "Review updated successfully",
      data: {
        id: review.id,
        bookId: review.bookId,
        reviewer: reviewerName,
        rating: review.rating,
        comment: review.comment,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Task 9: Delete a review (Authenticated, own only)
router.delete("/reviews/:reviewId", auth, (req, res) => {
  console.log("DELETE route hit for reviewId:", req.params.reviewId);
  try {
    const reviewId = parseInt(req.params.reviewId);
    const reviewIndex = reviews.findIndex((r) => r.id === reviewId);
    if (reviewIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }
    const review = reviews[reviewIndex];
    if (review.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized: Can only delete your own reviews",
      });
    }
    reviews.splice(reviewIndex, 1);
    saveReviews();

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
