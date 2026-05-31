const express = require("express");
const dotenv = require("dotenv").config();
const { connectDB } = require("../src/config/db");

const accessRoutes = require("./routes/access.routes");
const urlRoutes = require("./routes/url.routes");
const authRoutes = require("./routes/auth.routes");
const redirectRoutes = require("./routes/redirect.routes");

const app = express();

// Custom CORS Middleware to allow requests from frontend (localhost:5173)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// Remapped routes to match specification
app.use("/api/auth", authRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/url", urlRoutes);
app.use("/", redirectRoutes);

// Health Check
app.get("/health", (req, res) => {
  return res.send("Server is running fine");
});

module.exports = { app };
