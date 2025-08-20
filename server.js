const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// In-memory keys storage
let keys = [];

// Admin generates key
app.post("/api/generate", (req, res) => {
  const { password, days } = req.body;
  const MASTER_PASSWORD = "1234"; // Change your admin password
  if (password !== MASTER_PASSWORD) return res.json({ error: "Invalid password" });
  if (!days || days < 1) return res.json({ error: "Invalid days" });

  const key = Math.random().toString(36).substring(2, 12).toUpperCase();
  const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
  keys.push({ key, expiresAt });
  res.json({ key, expiresAt });
});

// Public predictor login: verify key
app.post("/api/verify", (req, res) => {
  const { key, deviceId } = req.body;
  const valid = keys.find(k => k.key === key && k.expiresAt > Date.now());
  if (valid) return res.json({ success: true });
  return res.json({ success: false, error: "Invalid or expired key" });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
