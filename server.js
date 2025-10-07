const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mount Routes (all under /api prefix)
app.use("/api", require("./routes/books")); // Tasks 1-4
app.use("/api", require("./routes/reviews")); // Tasks 5,8,9
app.use("/api", require("./routes/auth")); // Tasks 6-7

app.use((req, res, next) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
