const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Public folder serve karo
app.use(express.static(path.join(__dirname, "public")));

// Admin folder serve karo (optional)
app.use("/admin", express.static(path.join(__dirname, "admin")));

// API routes (example)
app.use(express.json());

app.post("/api/generate", (req, res) => {
  // yaha apna key generate logic hoga
  res.json({ key: "demo-key", expiresAt: Date.now() + 1000*60*60*24 });
});

// Agar kuch nahi mile toh index.html return karo
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
