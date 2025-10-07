const express = require("express");
const router = express.Router();
const { books } = require("../models/books");

// Task 1: Get the book list
router.get("/books", async (req, res) => {
  try {
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Task 2: Get book details by ISBN
router.get("/books/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books.find((b) => b.isbn === isbn);
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Task 3: Get books by author
router.get("/books/author/:author", async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const filteredBooks = books.filter((b) =>
      b.author.toLowerCase().includes(author)
    );
    res.json({ success: true, data: filteredBooks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Task 4: Get books by title
router.get("/books/title/:title", async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const filteredBooks = books.filter((b) =>
      b.title.toLowerCase().includes(title)
    );
    res.json({ success: true, data: filteredBooks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
