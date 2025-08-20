// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// DB setup
const db = new sqlite3.Database("./db.sqlite");
db.run(`CREATE TABLE IF NOT EXISTS keys (
  key TEXT PRIMARY KEY,
  createdAt INTEGER,
  expiresAt INTEGER,
  used INTEGER DEFAULT 0,
  assignedTo TEXT
)`);

app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/admin", express.static("admin"));

// Master password
const MASTER_PASSWORD = "Manas123@"; // आप बदल सकते हो

// Generate random key
function generateKey() {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}

// -------- API --------

// Generate key (admin use)
app.post("/api/generate", (req, res) => {
  const { password, days } = req.body;
  if (password !== MASTER_PASSWORD) return res.status(403).json({ error: "Unauthorized" });

  const key = generateKey();
  const createdAt = Date.now();
  const expiresAt = createdAt + days * 24 * 60 * 60 * 1000;

  db.run(`INSERT INTO keys (key, createdAt, expiresAt, used) VALUES (?,?,?,0)`,
    [key, createdAt, expiresAt], (err) => {
      if (err) return res.status(500).json({ error: "DB Error" });
      res.json({ key, expiresAt });
    });
});

// Verify key (user use)
app.post("/api/verify", (req, res) => {
  const { key, deviceId } = req.body;
  db.get(`SELECT * FROM keys WHERE key=?`, [key], (err, row) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    if (!row) return res.status(400).json({ error: "Invalid key" });

    if (Date.now() > row.expiresAt) return res.status(400).json({ error: "Key expired" });

    if (row.used && row.assignedTo !== deviceId) {
      return res.status(400).json({ error: "Key already used on another device" });
    }

    if (!row.used) {
      db.run(`UPDATE keys SET used=1, assignedTo=? WHERE key=?`, [deviceId, key]);
    }

    res.json({ success: true });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));