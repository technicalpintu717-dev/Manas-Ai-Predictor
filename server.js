const path = require("path");
const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// ✅ Public folder serve करो
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.post("/api/generate", (req, res) => {
  // ... आपका logic
});

// ✅ अगर कोई route match नहीं होता तो index.html serve हो
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
