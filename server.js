const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

// API endpoints
app.post("/api/verify", (req,res)=>{
  // verify logic here
});
app.post("/api/generate", (req,res)=>{
  // generate key logic here
});

// Catch-all for non-existent files
app.get("*",(req,res)=>{
  res.status(404).send("404 - Not Found");
});

app.listen(3000,()=>console.log("Server running at http://localhost:3000"));
