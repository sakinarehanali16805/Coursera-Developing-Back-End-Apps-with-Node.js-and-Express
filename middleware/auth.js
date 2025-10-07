const jwt = require("jsonwebtoken");
const SECRET = "gdhqyUUIGHVhHSOIUQnajhsq";

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
